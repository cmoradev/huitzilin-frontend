import { CurrencyPipe, JsonPipe } from '@angular/common';
import { Component, inject, Input, OnInit, output, signal, ChangeDetectionStrategy } from '@angular/core';
import {
  FormArray,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import {
  calculateAmountFromUnitPriceAndQuantity,
  calculateSubtotalAndDiscount,
  calculateTaxesFromSubtotal,
  TaxEnum,
} from '@calculations';
import { FormToolsService } from '@services';
import { merge, startWith } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SelectDebitDiscountFormDialogComponent } from '../select-debit-discount-form-dialog/select-debit-discount-form-dialog.component';
import { DiscountBy, DiscountPartsFragment } from '@graphql';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-debit-with-discount-form',
  imports: [
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,
    MatChipsModule,
    CurrencyPipe,
  ],
  templateUrl: './debit-with-discount-form.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class DebitWithDiscountFormComponent implements OnInit {
  @Input({ required: true }) formGroup!: FormGroup;

  public remove = output<void>();

  private readonly _dialog = inject(MatDialog);
  private readonly _formTools = inject(FormToolsService);

  public readonly formTools = inject(FormToolsService);

  public subtotal = signal(0);
  public subtotal$ = toObservable(this.subtotal);

  public amount = signal(0);
  public taxes = signal(0);
  public total = signal(0);

  ngOnInit(): void {
    this.formGroup.get('amount')?.disable();
    this.formGroup.get('discount')?.disable();

    merge(
      this.formGroup.get('unitPrice')!.valueChanges,
      this.formGroup.get('quantity')!.valueChanges
    )
      .pipe(startWith(0))
      .subscribe({
        next: () => {
          const unitPrice = this.formGroup.get('unitPrice')!.value;
          const quantity = this.formGroup.get('quantity')!.value;

          if (unitPrice !== undefined && quantity !== undefined) {
            const amount = calculateAmountFromUnitPriceAndQuantity(
              unitPrice,
              quantity
            );

            this.formGroup.get('amount')!.setValue(amount);
          }
        },
      });

    merge(
      this.formGroup.get('discounts')!.valueChanges,
      this.formGroup.get('amount')!.valueChanges
    )
      .pipe(startWith(0))
      .subscribe({
        next: () => {
          const discounts = this.formGroup.get('discounts')?.value;
          const amount = this.formGroup.get('amount')?.value;

          const { discount, subtotal } = calculateSubtotalAndDiscount(
            amount,
            discounts
          );

          this.formGroup.get('discount')?.setValue(discount);

          this.amount.set(amount);
          this.subtotal.set(subtotal);
        },
      });

    merge(this.formGroup.get('withTax')!.valueChanges, this.subtotal$).pipe(startWith(0)).subscribe({
      next: () => {
        const withTax = this.formGroup.get('withTax')?.value ?? false;

        const { taxes, total } = calculateTaxesFromSubtotal(
          this.subtotal(),
          withTax ? TaxEnum.Sixteen : TaxEnum.Zero
        );

        this.taxes.set(taxes);
        this.total.set(total);
      },
    });
  }

  public selectDebitDiscount() {
    const dialog$ = this._dialog.open(SelectDebitDiscountFormDialogComponent, {
      width: '32rem',
      disableClose: true,
    });

    dialog$.afterClosed().subscribe({
      next: (discount) => {
        if (discount) {
          this.addDebitDiscount(discount);
        }
      },
    });
  }

  public removeWidget(event: MouseEvent): void {
    event.stopPropagation();
    this.remove.emit();
  }

  public get discounts(): FormArray<FormGroup> {
    return this.formGroup.get('discounts') as FormArray<FormGroup>;
  }

  public removeDiscount(index: number): void {
    this.discounts.removeAt(index);
  }

  private addDebitDiscount(initialValues: DiscountPartsFragment): void {
    const { name, type, value, id } = initialValues;

    const debitDiscountFormGroup = this._formTools.builder.group({
      id: this._formTools.builder.control<string>(id, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      name: this._formTools.builder.control<string>(name, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      type: this._formTools.builder.control<DiscountBy>(type, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      value: this._formTools.builder.control<number>(value, {
        validators: [Validators.required, Validators.min(1)],
        nonNullable: true,
      }),
    });

    this.discounts.push(debitDiscountFormGroup);
  }
}
