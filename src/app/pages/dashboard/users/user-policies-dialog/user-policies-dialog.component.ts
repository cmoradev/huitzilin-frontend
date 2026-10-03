import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
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
import { firstValueFrom, map } from 'rxjs';

@Component({
  selector: 'app-user-policies-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatListModule,
    MatProgressBarModule,
  ],
  templateUrl: './user-policies-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class UserPoliciesDialogComponent implements OnInit {
  public data = inject<UserPartsFragment>(MAT_DIALOG_DATA);
  public loading = signal<boolean>(false);

  public loadingPolicies = signal<boolean>(false);
  public policies = signal<PolicyPartsFragment[]>([]);

  public readonly selectedIds = signal<string[]>([]);

  private readonly _dialogRef = inject(
    MatDialogRef<UserPoliciesDialogComponent>
  );
  private readonly _updateOneUserGQL = inject(UpdateOneUserGQL);
  private readonly _getUserPoliciesGQL = inject(GetUserPoliciesGQL);
  private readonly _fetchPoliciesGQL = inject(GetPoliciesPageGQL);

  constructor() {
    effect(() => {
      this._dialogRef.disableClose = this.loading();
    });
  }

  ngOnInit() {
    this.fetchAllPolicies();
    this.fetchUserPolicies(this.data.id);
  }

  public isSelected(id: string): boolean {
    return this.selectedIds().includes(id);
  }

  public togglePolicy(id: string): void {
    this.selectedIds.update((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id]
    );
  }

  public async savePolicies(): Promise<void> {
    if (!this.data?.id) {
      return;
    }

    this.loading.set(true);

    try {
      const updated = await firstValueFrom(
        this._updateOneUserGQL.mutate({
          variables: {
            id: this.data.id,
            update: {
              policies: this.selectedIds().map((id) => ({ id })),
            },
          },
        })
      );

      this._dialogRef.close(updated.data?.updateOneUser);
    } catch (error) {
      console.error('Error actualizando políticas del usuario:', error);
    } finally {
      this.loading.set(false);
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

    const fetch$ = this._fetchPoliciesGQL
      .watch({
        variables,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: false,
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
          return;
        }

        this.fetchAllPolicies(allItems);
      },
      error: (error) => {
        console.error('Error fetching policies', error);
      },
    });
  }

  private fetchUserPolicies(userId: string): void {
    this._getUserPoliciesGQL
      .watch({
        variables: { id: userId },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
      })
      .valueChanges.subscribe({
        next: ({ data }) => {
          const userPolicies = data?.user?.policies ?? [];
          this.selectedIds.set(
            userPolicies
              .map((policy) => policy?.id)
              .filter((id): id is string => typeof id === 'string')
          );
        },
        error: (error) => {
          console.error('Error fetching user policies', error);
        },
      });
  }
}