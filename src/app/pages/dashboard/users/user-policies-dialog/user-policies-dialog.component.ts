import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  GetPoliciesPageGQL,
  GetPoliciesPageQueryVariables,
  GetUserPoliciesGQL,
  PolicyPartsFragment,
  UpdateOneUserGQL,
  UserPartsFragment,
} from '@graphql';
import { map } from 'rxjs';

@Component({
  selector: 'app-user-policies-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatListModule,
    MatProgressBarModule,
    ReactiveFormsModule,
  ],
  templateUrl: './user-policies-dialog.component.html',
  styles: ``,
})
export class UserPoliciesDialogComponent implements OnInit {
  public policiesFormControl = new FormControl<string[]>([]);

  public data = inject<UserPartsFragment>(MAT_DIALOG_DATA);
  public loading = signal<boolean>(false);

  public loadingPolicies = signal<boolean>(false);
  public policies = signal<PolicyPartsFragment[]>([]);

  private readonly _dialogRef = inject(
    MatDialogRef<UserPoliciesDialogComponent>
  );
  private readonly updateOneUserGQL = inject(UpdateOneUserGQL);
  private readonly getUserPoliciesGQL = inject(GetUserPoliciesGQL);

  ngOnInit() {
    this.fetchAllPolicies();

    this.fetchUserPolicies(this.data.id);
  }

  private readonly _fetch = inject(GetPoliciesPageGQL);

  public savePolicies() {
    if (!!this.data?.id) {
      this.loading.set(true);

      this.updateOneUserGQL
        .mutate({
          variables: {
            id: this.data?.id,
            update: {
              policies:
                this.policiesFormControl.value?.map((id) => ({ id })) ?? [],
            },
          },
        })
        .subscribe({
          next: ({ data }) => {
            this.loading.set(false);
            this._dialogRef.close(data?.updateOneUser);
          },
          error: (error) => {
            this.loading.set(false);
            console.error('Error creating user:', error);
          },
        });
    }
  }

  private fetchAllPolicies(accumulared: PolicyPartsFragment[] = []): void {
    this.loadingPolicies.set(true);

    const limit = 50;
    const offset = accumulared.length;

    const variables: GetPoliciesPageQueryVariables = {
      limit,
      offset,
    };

    const fetch$ = this._fetch
      .watch({
        variables,
        fetchPolicy: 'cache-and-network', // Usa cache primero, solo pide a la API si no hay datos en cache
        nextFetchPolicy: 'cache-and-network', // Mantiene la política de cache en siguientes peticiones
        notifyOnNetworkStatusChange: false, // No notifica cambios de red para evitar refetch innecesario
      })
      .valueChanges;

    fetch$.pipe(map((resp) => resp.data?.policies)).subscribe({
      next: (policies) => {
        if (!policies) return;

        const nodes = (policies.nodes ?? []) as PolicyPartsFragment[];
        const totalCount = policies.totalCount ?? 0;

        const allItems = accumulared.concat(nodes);

        if (allItems.length >= totalCount) {
          this.policies.set(allItems);
          this.loadingPolicies.set(false);
          return; // No more fees to fetch
        }

        this.fetchAllPolicies(allItems);
      },
      error: (error) => {
        console.error('Error fetching policies', error);
      },
    });
  }

  private fetchUserPolicies(userId: string): void {
    this.getUserPoliciesGQL
      .watch({
        variables: { id: userId },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
      })
      .valueChanges.subscribe({
        next: ({ data }) => {
          const userPolicies = data?.user?.policies ?? [];
          this.policiesFormControl.setValue(
            userPolicies
              .map((policy) => policy?.id)
              .filter((id) => typeof id === 'string') as string[]
          );
        },
        error: (error) => {
          console.error('Error fetching user policies', error);
        },
      });
  }
}
