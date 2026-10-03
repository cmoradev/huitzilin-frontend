import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
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
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-student-state',
  imports: [
    MatLabel,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatInput,
    MatOption,
    MatFormField,
    MatIcon,
    MatRipple,
    AvatarComponent,
  ],
  templateUrl: './student-state.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class StudentStateComponent {
  public searching = signal<boolean>(true);
  public readonly studentQuery = signal('');
  public readonly selectedStudent = signal<StudentPartsFragment | null>(null);
  public loadingStudents = signal<boolean>(false);
  public students = signal<StudentPartsFragment[]>([]);

  private readonly _fetchStudentGQL = inject(FetchStudentGQL);

  private readonly _globalStateService = inject(GlobalStateService);

  public student = computed(() => this._globalStateService.student);

  private readonly _branch = toSignal(this._globalStateService.branch$, {
    initialValue: this._globalStateService.branch,
  });

  private readonly _studentState = toSignal(
    this._globalStateService.student$,
    { initialValue: this._globalStateService.student }
  );

  /**
   * Versión con debounce del término de búsqueda para evitar peticiones
   * excesivas mientras el usuario escribe.
   */
  private readonly _debouncedStudentQuery = signal('');

  constructor() {
    // Sincroniza el estudiante global con el control local.
    effect(() => {
      const student = this._studentState();
      this.searching.set(student === null);

      if (student === null) {
        this.selectedStudent.set(null);
        this.studentQuery.set('');
      }
    });

    // Limpia el buscador al cambiar de sucursal (igual que el original).
    effect(() => {
      this._branch();
      this.selectedStudent.set(null);
      this.studentQuery.set('');
      this._fetchStudents('');
    });

    // Aplica la selección al estado global cuando se elige un estudiante.
    effect(() => {
      const selected = this.selectedStudent();
      if (selected) {
        this._globalStateService.student = selected;
      }
    });

    // Reacciona al término de búsqueda (con debounce) y a cambios de sucursal.
    toObservable(this.studentQuery)
      .pipe(debounceTime(300))
      .subscribe((value) => {
        this._debouncedStudentQuery.set(value);
      });

    effect(() => {
      const term = this._debouncedStudentQuery();
      this._branch();
      this._fetchStudents(term);
    });
  }

  public onSearchInput(event: Event): void {
    this.studentQuery.set((event.target as HTMLInputElement).value);
  }

  public onStudentSelected(student: StudentPartsFragment): void {
    this.selectedStudent.set(student);
    this.studentQuery.set(student.fullname);
    this.searching.set(false);
  }

  public toggleStudent(): void {
    this.searching.update((prev) => !prev);

    if (this.searching()) {
      this.selectedStudent.set(null);
      this.studentQuery.set('');
    }
  }

  public displayFn(value: StudentPartsFragment): string {
    return value?.fullname ?? '';
  }

  private _fetchStudents(value: string): void {
    const branch = this._globalStateService.branch;
    if (!!branch?.id) {
      this.loadingStudents.set(true);

      this._fetchStudentGQL
        .watch({
          variables: {
            limit: 50,
            offset: 0,
            filter: {
              active: { is: true },
              branchs: { id: { eq: branch.id } },
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