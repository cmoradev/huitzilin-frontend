import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  calculateAmountFromUnitPriceAndQuantity,
  calculateSubtotalAndDiscount,
  calculateTaxesFromSubtotal,
  TaxEnum,
} from '@calculations';
import { MatDialog } from '@angular/material/dialog';
import { SelectDebitDiscountFormDialogComponent } from '../select-debit-discount-form-dialog/select-debit-discount-form-dialog.component';
import { DiscountPartsFragment } from '@graphql';
import {
  applyEach,
  debounce,
  disabled,
  form,
  max,
  min,
  required,
} from '@angular/forms/signals';
import { CatalogDebitFields, DebitDiscountFormFields } from '@app/types/debits';
import { CurrencyPipe } from '@angular/common';

/**
 * Wrapper Signal Forms que reemplaza al antiguo
 * `DebitWithDiscountFormComponent` (basado en `FormGroup`). Mantiene
 * la misma API pública (`debit` como input, `remove` como output) y
 * delega todo el cálculo de importes, descuentos y totales al padre.
 */
@Component({
  selector: 'app-debit-with-discount-form',
  imports: [
    MatExpansionModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    CurrencyPipe,
  ],
  templateUrl: './debit-with-discount-form.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class DebitWithDiscountFormComponent implements OnInit {
  public readonly debit = input.required<CatalogDebitFields>();
  public readonly index = input.required<number>();

  public readonly remove = output<void>();
  public readonly update = output<CatalogDebitFields>();

  public readonly quantityControl = computed(() => this.debit().quantity);

  private readonly _dialog = inject(MatDialog);

  // Modelo interno mutable requerido por `form()`.
  private readonly _model = signal<CatalogDebitFields>({
    description: '',
    unitPrice: 0,
    quantity: 1,
    amount: 0,
    delinquency: 0,
    discount: 0,
    withTax: true,
    state: 'DEBT' as CatalogDebitFields['state'],
    frequency: 'SINGLE' as CatalogDebitFields['frequency'],
    dueDate: '',
    discounts: [],
  });

  public readonly debitForm = form(this._model, (schema) => {
    required(schema.description);
    required(schema.unitPrice);
    min(schema.unitPrice, 1);
    required(schema.quantity);
    min(schema.quantity, 1);
    required(schema.dueDate);
    required(schema.state);
    required(schema.frequency);
    required(schema.discounts);

    disabled(schema.amount);
    disabled(schema.discount);

    debounce(schema.unitPrice, 200);
    debounce(schema.quantity, 200);

    applyEach(schema.discounts, (item) => {
      required(item.id);
      required(item.name);
      required(item.type);
      required(item.value);
      min(item.value, 1);
    });

    max(schema.discount, 0);
  });

  public readonly amount = computed(() => {
    const model = this._model();
    return calculateAmountFromUnitPriceAndQuantity(
      model.unitPrice,
      model.quantity
    );
  });

  public readonly subtotal = computed(() => {
    const model = this._model();
    return calculateSubtotalAndDiscount(model.amount, model.discounts).subtotal;
  });

  public readonly taxes = computed(() => {
    const model = this._model();
    return calculateTaxesFromSubtotal(
      this.subtotal(),
      model.withTax ? TaxEnum.Sixteen : TaxEnum.Zero
    ).taxes;
  });

  public readonly total = computed(() => {
    const model = this._model();
    return calculateTaxesFromSubtotal(
      this.subtotal(),
      model.withTax ? TaxEnum.Sixteen : TaxEnum.Zero
    ).total;
  });

  private _lastEmitted: CatalogDebitFields | null = null;

  constructor() {
    effect(() => {
      const incoming = this.debit();
      this._model.set(incoming);
    });

    effect(() => {
      const calculated = this.amount();
      const current = this._model();
      if (calculated !== current.amount) {
        this._model.update((m) => ({ ...m, amount: calculated }));
      }
    });

    effect(() => {
      const model = this._model();
      const { discount } = calculateSubtotalAndDiscount(
        model.amount,
        model.discounts
      );

      if (discount !== model.discount) {
        this._model.update((m) => ({ ...m, discount }));
      }
    });

    effect(() => {
      const current = this._model();

      // Evita el ciclo infinito padre -> hijo -> padre: cuando el padre
      // re-escribe el mismo contenido (nueva referencia de objeto), no se
      // re-emite.
      if (
        this._lastEmitted &&
        JSON.stringify(this._lastEmitted) === JSON.stringify(current)
      ) {
        return;
      }

      this._lastEmitted = current;
      this.update.emit({ ...current });
    });
  }

  ngOnInit(): void {
    // El cálculo inicial se realiza mediante los `effect`s del constructor.
  }

  public selectDebitDiscount(): void {
    const dialog$ = this._dialog.open(SelectDebitDiscountFormDialogComponent, {
      width: '32rem',
      disableClose: true,
    });

    dialog$.afterClosed().subscribe({
      next: (discount: DiscountPartsFragment | undefined) => {
        if (discount) {
          this.addDiscount(discount);
        }
      },
    });
  }

  public addDiscount(discount: DiscountPartsFragment): void {
    const next: DebitDiscountFormFields = {
      id: discount.id,
      name: discount.name,
      type: discount.type,
      value: discount.value,
    };

    this._model.update((m) => ({
      ...m,
      discounts: [...m.discounts, next],
    }));
  }

  public removeDiscount(index: number): void {
    this._model.update((m) => ({
      ...m,
      discounts: m.discounts.filter((_, idx) => idx !== index),
    }));
  }

  public removeWidget(event: MouseEvent): void {
    event.stopPropagation();
    this.remove.emit();
  }

  public onDescriptionChange(value: string): void {
    this._model.update((m) => ({ ...m, description: value }));
  }

  public onUnitPriceChange(value: number): void {
    this._model.update((m) => ({ ...m, unitPrice: value }));
  }

  public onQuantityChange(value: number): void {
    this._model.update((m) => ({ ...m, quantity: value }));
  }

  public onDueDateChange(value: string): void {
    this._model.update((m) => ({ ...m, dueDate: value }));
  }

  public onWithTaxChange(checked: boolean): void {
    this._model.update((m) => ({ ...m, withTax: checked }));
  }
}
