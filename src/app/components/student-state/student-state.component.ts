import {
  AfterViewInit,
  booleanAttribute,
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
  MatOption,
} from '@angular/material/autocomplete';
import { MatRipple } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { AvatarComponent } from '@components/avatar/avatar.component';
import { FetchStudentGQL, StudentPartsFragment } from '@graphql';
import { GlobalStateService } from '@services';
import { debounceTime, filter, merge, startWith } from 'rxjs';

@Component({
  selector: 'app-student-state',
  imports: [
    MatLabel,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatInput,
    MatOption,
    MatFormField,
    ReactiveFormsModule,
    MatIcon,
    MatRipple,
    AvatarComponent,
  ],
  templateUrl: './student-state.component.html',
  styles: ``,
})
export class StudentStateComponent implements AfterViewInit, OnInit {
  public searching = signal<boolean>(true);
  public studentControl = new FormControl<StudentPartsFragment | string>('');
  public loadingStudents = signal<boolean>(false);
  public students = signal<StudentPartsFragment[]>([]);

  private readonly _fetchStudentGQL = inject(FetchStudentGQL);

  private readonly _globalStateService = inject(GlobalStateService);

  public student = computed(() => this._globalStateService.student);

  ngOnInit(): void {
    // @todo - Existe un bug al cambiar de sucursal, no refrescar el autocomplete

    merge(this._globalStateService.branch$).subscribe({
      next: () => {
        this.studentControl.setValue('');
        this._fetchStudents('');
      },
    });

    this._globalStateService.student$.subscribe({
      next: (student) => {
        this.searching.set(student === null);

        if (student === null) {
          this.studentControl.setValue('');
        }
      },
    });
  }

  ngAfterViewInit(): void {
    merge(this.studentControl.valueChanges, this._globalStateService.branch$)
      .pipe(debounceTime(300), startWith(''))
      .subscribe({
        next: (value) => {
          if (typeof value === 'string') this._fetchStudents(value);
        },
      });

    this.studentControl.valueChanges
      .pipe(filter((value) => typeof value === 'object'))
      .subscribe({
        next: (value) => {
          this._globalStateService.student = value;
        },
      });
  }

  public toggleStudent(): void {
    this.searching.update((prev) => !prev);
  }

  public displayFn(value: StudentPartsFragment): string {
    return value?.fullname ?? '';
  }

  private _fetchStudents(value: string): void {
    if (!!this._globalStateService.branch?.id) {
      this.loadingStudents.set(true);

      this._fetchStudentGQL
        .watch({
          variables: {
            limit: 50,
            offset: 0,
            filter: {
              active: { is: true },
              branchs: { id: { eq: this._globalStateService.branch!.id } },
              or: [
                { fullname: { iLike: `%${value}%` } },
                { code: { eq: `${value}` } },
                { dni: { eq: `${value}` } },
              ],
            },
          },
          fetchPolicy: 'cache-and-network',
          nextFetchPolicy: 'cache-and-network',
          notifyOnNetworkStatusChange: true,
        })
        .valueChanges.subscribe({
          next: ({ loading, data }) => {
            this.loadingStudents.set(loading);

            this.students.set(
              (data?.students?.nodes ?? []) as StudentPartsFragment[]
            );
          },
        });
    }
  }
}
