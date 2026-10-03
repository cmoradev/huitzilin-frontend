import { CurrencyPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  CurrentEnrollmentPartsFragment,
  DebitPartsFragment,
  DebitState,
} from '@graphql';
import { isAfter } from 'date-fns';
import { skip } from 'rxjs';
import { PosService } from '../../../../services/pos.service';
import { CompletePaymentDialogComponent } from '../complete-payment-dialog/complete-payment-dialog.component';

@Component({
  selector: 'app-concept-option',
  imports: [
    MatCheckboxModule,
    MatRippleModule,
    MatIconModule,
    MatTooltipModule,
    CurrencyPipe,
  ],
  templateUrl: './concept-option.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./concept-option.component.scss'],
})
export class ConceptOptionComponent implements AfterViewInit {
  private readonly pos = inject(PosService);

  private readonly _dialog = inject(MatDialog);

  public debit = input.required<DebitPartsFragment>();
  public enrollment = input.required<CurrentEnrollmentPartsFragment>();
  public refresh = output<void>();

  public pendingPayment = computed(() => {
    const [concept] = this.debit().concepts;

    return concept?.pendingPayment ?? this.debit().total;
  });
  public isDebit = computed(() => this.debit().state === DebitState.Debt);
  public isDebitPartiallyPaid = computed(
    () => this.debit().state === DebitState.PartiallyPaid
  );
  public isDebitWithDelay = computed(() => {
    const dueDate = new Date(this.debit().dueDate);

    return this.isDebit() && isAfter(new Date(), dueDate);
  });

  public nametag = computed(() => {
    if (this.isDebitWithDelay()) {
      return 'Con retraso';
    } else if (this.isDebitPartiallyPaid()) {
      return 'Parcialmente Pagado';
    } else if (this.isDebit()) {
      return 'Deuda';
    }
    return 'Desconocido';
  });

  public marked = signal<boolean>(false);
  private readonly _marked$ = toObservable(this.marked);

  public stateTag = computed(() => {
    const dueDate = new Date(this.debit().dueDate);
    const isOverdue = isAfter(new Date(), dueDate);

    if (isOverdue) {
      return 'Vencido';
    }

    if (this.debit().state === DebitState.Debt) {
      return 'Deuda';
    } else if (this.debit().state === DebitState.PartiallyPaid) {
      return 'Parcialmente Pagado';
    }

    return 'Desconocido';
  });

  ngAfterViewInit(): void {
    this._markAsOverdue();

    this._marked$.pipe(skip(1)).subscribe({
      next: (value) => this.toggleDebit(value),
    });
  }

  public select(event: MouseEvent): void {
    event.stopPropagation();

    this.marked.update((prev) => !prev);
  }

  public toggleDebit(active: boolean): void {
    if (active) {
      if (this.debit().state === DebitState.PartiallyPaid) {
        this.addPaymentOnIncome();
      } else {
        const added = this.pos.addConcept({
          debitID: this.debit().id,
          description: this.debit().description,
          unitPrice: this.debit().unitPrice,
          quantity: this.debit().quantity,
          discounts: this.debit().discounts,
          withTax: this.debit().withTax,
          dueDate: this.debit().dueDate,
          delinquency: this.debit().delinquency,
          studentID: this.enrollment().studentId,
          enrollmentID: this.enrollment().id,
          enrollmentDetails: this.enrollment().details,
          branchID: this.enrollment().branchId,
          branchName: this.enrollment().branch!.name,
        });

        if (!added) this.marked.set(false);
      }
    } else {
      this.pos.removeDebit(this.debit());
    }
  }

  private addPaymentOnIncome(): void {
    const $dialog = this._dialog.open(CompletePaymentDialogComponent, {
      width: '32rem',
      data: {
        debit: this.debit(),
        branchID: this.enrollment().branchId,
        studentID: this.enrollment().studentId,
      },
    });

    $dialog.afterClosed().subscribe({
      next: (added) => {
        if (added) this.refresh.emit();

        this.marked.set(false);
      },
    });
  }

  private _markAsOverdue(): void {
    const today = new Date();
    const dueDate = new Date(this.debit().dueDate);

    if (isAfter(today, dueDate)) {
      this.marked.set(true);
    }
  }
}