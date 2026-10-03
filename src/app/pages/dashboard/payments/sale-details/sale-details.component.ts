import { CurrencyPipe, } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  output,
  signal,
  ChangeDetectionStrategy
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  CreateConcept,
  CreateIncomesGQL,
  CreatePayment,
  DebitPartsFragment,
} from '@graphql';
import { Concept, PosService } from '@services';
import { NgScrollbar } from 'ngx-scrollbar';
import { ChargeDialogComponent } from '../charge-dialog/charge-dialog.component';
import { ClipChargeDialogComponent } from '../clip-charge-dialog/clip-charge-dialog.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sale-details',
  imports: [
    MatButtonModule,
    NgScrollbar,
    CurrencyPipe,
    MatTooltipModule,
    MatIconModule,
],
  templateUrl: './sale-details.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./sale-details.component.scss'],
})
export class SaleDetailsComponent {
  private readonly _pos = inject(PosService);
  private readonly _dialog = inject(MatDialog);
  private readonly _snackBar = inject(MatSnackBar);
  private readonly _createIncomes = inject(CreateIncomesGQL);

  public refresh = output<void>();
  public conceptGroups = signal<EnrollmentGroup[]>([]);
  public expandedElement: DebitPartsFragment | null = null;

  public amount = computed(() => this._pos.amount);
  public discount = computed(() => this._pos.discount);
  public subtotal = computed(() => this._pos.subtotal);
  public taxes = computed(() => this._pos.taxes);
  public total = computed(() => this._pos.total);
  public loading = signal<boolean>(false);

  constructor() {
    effect(() => {
      this.conceptGroups.set(this._groupByEnrollment(this._pos.concepts));
    });
  }

  public removeConcept(concept: Concept) {
    this._pos.removeConcept(concept);
  }

  public openClipChargeDialog() {
    const dislog$ = this._dialog.open(ClipChargeDialogComponent, {
      width: '32rem',
      disableClose: true,
    });

    dislog$.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this._pos.clearConcepts();
          this.refresh.emit();
        }
      },
    });
  }

  public openChargeDialog() {
    const $dislog = this._dialog.open<
      ChargeDialogComponent,
      number,
      CreatePayment[]
    >(ChargeDialogComponent, {
      width: '32rem',
      data: this.total(),
      disableClose: true,
    });

    $dislog.afterClosed().subscribe({
      next: (payments) => {
        if (!!payments && !!payments.length) {
          const concepts: CreateConcept[] = this._pos.concepts.map(
            (concept) => ({
              description: concept.description,
              debitId: concept.debitID,
              quantity: concept.quantity,
              unitPrice: concept.unitPrice,
              withTax: concept.withTax,
              branchID: concept.branchID,
              application: concept.application,
              discounts: concept.discounts.map((discount) => ({
                id: discount.id,
              })),
            })
          );

          const studentIDs = this._pos.studentIDs;

          if (!!studentIDs.length && !!concepts.length) {
            this._createIncomes
              .mutate({
                variables: {
                  input: {
                    studentIDs,
                    payments,
                    concepts,
                  },
                },
              })
              .subscribe({
                next: () => {
                  this.loading.set(false);
                  this._snackBar.open(
                    'Se han creado los ingresos correctamente',
                    'Cerrar',
                    {
                      duration: 3000,
                      horizontalPosition: 'center',
                      verticalPosition: 'bottom',
                    }
                  );
                  this._pos.clearConcepts();
                  this.refresh.emit();
                },
                error: (error) => {
                  this.loading.set(false);
                  // console.error('Error creating incomes:', error);
                },
              });
          }
        }
      },
    });
  }

  /** Checks whether an element is expanded. */
  public isExpanded(element: DebitPartsFragment) {
    return this.expandedElement === element;
  }

  /** Toggles the expanded state of an element. */
  public toggle(element: DebitPartsFragment) {
    this.expandedElement = this.isExpanded(element) ? null : element;
  }

  private readonly _groupByEnrollment = (concepts: Concept[]) => {
    const groups = concepts.reduce((acc, current) => {
      if (!acc.has(current.enrollmentID)) {
        const grouped = {
          enrollmentID: current.enrollmentID,
          enrollmentDetails: current.enrollmentDetails,
          branchID: current.branchID,
          branchName: current.branchName,
          concepts: [],
        };

        acc.set(current.enrollmentID, grouped);
      }

      acc.get(current.enrollmentID)?.concepts.push(current);

      return acc;
    }, new Map<string, EnrollmentGroup>());

    return Array.from(groups.values());
  };
}

type EnrollmentGroup = {
  enrollmentID: string;
  enrollmentDetails: string;
  branchID: string;
  branchName: string;
  concepts: Concept[];
};
