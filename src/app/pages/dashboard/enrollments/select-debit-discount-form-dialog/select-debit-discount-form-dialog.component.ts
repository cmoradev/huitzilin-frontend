import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  DiscountPartsFragment,
  GetDiscountsPageGQL,
  GetDiscountsPageQueryVariables,
} from '@graphql';
import { GlobalStateService } from '@services';
import { map } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { CurrencyPipe } from '@angular/common';
import {
  form,
  FormField,
  FormRoot,
  required,
} from '@angular/forms/signals';
import { SelectDiscountFormFields } from '@app/types/discounts';

@Component({
  selector: 'app-select-debit-discount-form-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    CurrencyPipe,
    FormField,
    FormRoot,
  ],
  templateUrl: './select-debit-discount-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class SelectDebitDiscountFormDialogComponent implements OnInit {
  private readonly _globalState = inject(GlobalStateService);

  private readonly _dialogRef = inject(
    MatDialogRef<SelectDebitDiscountFormDialogComponent>
  );

  private readonly _discountsPageGQL = inject(GetDiscountsPageGQL);

  public discounts = signal<DiscountPartsFragment[]>([]);
  public loading = signal(false);

  public readonly selectModel = signal<SelectDiscountFormFields>({
    discountId: null,
  });

  public readonly selectForm = form(this.selectModel, (schema) => {
    required(schema.discountId, { message: 'Seleccione un descuento' });
  });

  constructor() {
    effect(() => {
      this._dialogRef.disableClose = this.loading();
    });
  }

  ngOnInit(): void {
    this._fetchAllDiscounts();
  }

  public submit(): void {
    if (this.selectForm().invalid()) {
      return;
    }

    const id = this.selectModel().discountId;
    const selected = id ? this.discounts().find((d) => d.id === id) : null;

    if (selected) {
      this._dialogRef.close(selected);
    }
  }

  private _fetchAllDiscounts(accumulared: DiscountPartsFragment[] = []): void {
    const branch = this._globalState.branch;
    if (!branch?.id) {
      return;
    }

    const limit = 50;
    const offset = accumulared.length;

    const params: GetDiscountsPageQueryVariables = {
      filter: {
        branchId: { eq: branch.id },
      },
      limit,
      offset,
    };

    this._discountsPageGQL
      .watch({
        variables: params,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: false,
      })
      .valueChanges.subscribe({
        next: (resp) => {
          const discounts = resp.data?.discounts;
          if (!discounts) {
            return;
          }

          const nodes = (discounts.nodes ?? []) as DiscountPartsFragment[];
          const totalCount = discounts.totalCount ?? 0;
          const allItems = accumulared.concat(nodes);

          if (allItems.length >= totalCount) {
            this.discounts.set(allItems);
            return;
          }

          this._fetchAllDiscounts(allItems);
        },
        error: (error) => {
          console.error('Error fetching discounts', error);
        },
      });
  }
}