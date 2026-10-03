import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { DeleteOnePeriodGQL, PeriodPartsFragment } from '@graphql';
import { DayOfWeekPipe } from '@pipes';

@Component({
  selector: 'app-calendar-delete-dialog',
  imports: [MatDialogModule, MatButtonModule, DayOfWeekPipe],
  templateUrl: './calendar-delete-dialog.component.html',
  styles: ``,
})
export class CalendarDeleteDialogComponent {
  public loading = signal(false);

  public data: PeriodPartsFragment = inject(MAT_DIALOG_DATA);

  private readonly _deleteOnePeriod = inject(DeleteOnePeriodGQL);
  private readonly _dialogRef = inject(
    MatDialogRef<CalendarDeleteDialogComponent>
  );

  public delete() {
    if (!!this.data.id) {
      this.loading.set(true);

      this._deleteOnePeriod
        .mutate({ variables: { id: this.data.id } })
        .subscribe({
        next: (cycle) => {
          this._dialogRef.close(cycle.data?.deleteOnePeriod);
        },
        error: (err) => {
          console.error('DELETE CYCLE ERROR: ', err);
        },
        complete: () => {
          this.loading.set(false);
        },
      });
    }
  }
}
