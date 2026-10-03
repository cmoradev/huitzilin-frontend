import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';
import {
  applyWhen,
  debounce,
  form,
  required,
} from '@angular/forms/signals';
import { PaymentMethod } from '@graphql';
import { PaymentFormFields } from '@app/types/payments';

@Component({
  selector: 'app-charge-form',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatTimepickerModule,
  ],
  templateUrl: './charge-form.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class ChargeFormComponent {
  public readonly payment = input.required<PaymentFormFields>();
  public readonly update = output<PaymentFormFields>();

  // Modelo interno mutable requerido por `form()`.
  private readonly _model = signal<PaymentFormFields>({
    method: PaymentMethod.Transfer,
    amount: 0,
    date: new Date().toISOString(),
    transaction: '',
    bank: '',
  });

  public readonly paymentForm = form(this._model, (schema) => {
    required(schema.amount);
    debounce(schema.amount, 200);
    required(schema.date);

    applyWhen(
      schema,
      ({ valueOf }) =>
        !!valueOf(schema.amount) && valueOf(schema.method) !== PaymentMethod.Cash,
      (schema) => {
        required(schema.transaction, { message: 'Referencia requerida' });
        required(schema.bank, { message: 'Banco requerido' });
      }
    );
  });

  constructor() {
    effect(() => {
      const incoming = this.payment();
      this._model.set(incoming);
    });

    effect(() => {
      const current = this._model();
      const incoming = this.payment();

      // No re-emitir si el contenido es idéntico al que envía el padre:
      // evita el ciclo infinito padre -> hijo -> padre (cada escritura del
      // padre crea una nueva referencia de objeto y re-dispararía el efecto).
      if (this._sameFields(current, incoming)) {
        return;
      }

      this.update.emit({ ...current });
    });
  }

  private _sameFields(a: PaymentFormFields, b: PaymentFormFields): boolean {
    return (
      a.method === b.method &&
      a.amount === b.amount &&
      a.date === b.date &&
      a.transaction === b.transaction &&
      a.bank === b.bank
    );
  }

  public onAmount(value: number): void {
    this._model.update((m) => ({ ...m, amount: value }));
  }

  public onDate(value: string): void {
    this._model.update((m) => ({ ...m, date: value }));
  }

  public onTransaction(value: string): void {
    this._model.update((m) => ({ ...m, transaction: value }));
  }

  public onBank(value: string): void {
    this._model.update((m) => ({ ...m, bank: value }));
  }
}
