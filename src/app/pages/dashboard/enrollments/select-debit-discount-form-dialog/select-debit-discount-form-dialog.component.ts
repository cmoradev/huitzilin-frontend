import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  DiscountPartsFragment,
  GetDiscountsPageGQL,
  GetDiscountsPageQueryVariables,
} from '@graphql';
import { FormToolsService, GlobalStateService } from '@services';
import { map } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-select-debit-discount-form-dialog',
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    CurrencyPipe
  ],
  templateUrl: './select-debit-discount-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class SelectDebitDiscountFormDialogComponent {
  private readonly _globalState = inject(GlobalStateService);
  public readonly formTools = inject(FormToolsService);

  private readonly _dialogRef = inject(
    MatDialogRef<SelectDebitDiscountFormDialogComponent>
  );

  private readonly _discountsPageGQL = inject(GetDiscountsPageGQL);

  public discounts = signal<DiscountPartsFragment[]>([]);
  public loading = signal(false);

  public formGroup = this.formTools.builder.group({
    discount: this.formTools.builder.control<DiscountPartsFragment | null>(
      null,
      {
        validators: [Validators.required],
        nonNullable: true,
      }
    ),
  });

  ngOnInit(): void {
    this._fetchAllDiscounts();
  }

  public submit(): void {
    if (this.formGroup.valid) {
      this.loading.set(true);

      const values = this.formGroup.getRawValue();

      if (values.discount?.id) {
        this._dialogRef.close(values.discount);
      }
    }
  }

  private _fetchAllDiscounts(accumulared: DiscountPartsFragment[] = []): void {
    if (this._globalState.branch?.id) {
      const limit = 50;
      const offset = accumulared.length;

      const params: GetDiscountsPageQueryVariables = {
        filter: {
          branchId: { eq: this._globalState.branch!.id },
        },
        limit,
        offset,
      };

      const getDiscounts$ = this._discountsPageGQL
        .watch({
          variables: params,
          fetchPolicy: 'cache-and-network', // Usa cache primero, solo pide a la API si no hay datos en cache
          nextFetchPolicy: 'cache-and-network', // Mantiene la política de cache en siguientes peticiones
          notifyOnNetworkStatusChange: false, // No notifica cambios de red para evitar refetch innecesario
        })
        .valueChanges;

      getDiscounts$.pipe(map((resp) => resp.data?.discounts)).subscribe({
        next: (discounts) => {
          if (!discounts) return;

          const nodes = (discounts.nodes ?? []) as DiscountPartsFragment[];
          const totalCount = discounts.totalCount ?? 0;

          const allItems = accumulared.concat(nodes);

          if (allItems.length >= totalCount) {
            this.discounts.set(allItems);
            return; // No more fees to fetch
          }

          this._fetchAllDiscounts(allItems);
        },
        error: (error) => {
          console.error('Error fetching fees', error);
        },
      });
    }
  }
}
