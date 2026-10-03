import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  CreateOneUserGQL,
  UpdateOneUserGQL,
  UserPartsFragment,
} from '@graphql';
import {
  BranchToolsService,
  CycleToolsService,
  FormToolsService,
} from '@services';
import { startWith } from 'rxjs';

@Component({
  selector: 'app-user-form-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './user-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class UserFormDialogComponent implements OnInit {
  public formTools = inject(FormToolsService);
  public loading = signal<boolean>(false);
  public data = inject<UserPartsFragment | null>(MAT_DIALOG_DATA);

  private readonly _dialogRef = inject(MatDialogRef<UserFormDialogComponent>);
  private readonly createOneUserGQL = inject(CreateOneUserGQL);
  private readonly updateOneUserGQL = inject(UpdateOneUserGQL);

  public branchTools = inject(BranchToolsService);
  public cycleTools = inject(CycleToolsService);

  public formGroup = this.formTools.builder.group({
    username: this.formTools.builder.control<string>(
      this.data?.username ?? '',
      {
        validators: [Validators.required, Validators.minLength(4)],
        asyncValidators: [this.formTools.isUsernameValid],
        nonNullable: true,
      }
    ),
    password: this.formTools.builder.control<string>('', {
      validators: [Validators.required, Validators.minLength(8)],
      nonNullable: true,
    }),
    email: this.formTools.builder.control<string>(this.data?.email ?? '', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    branchId: this.formTools.builder.control<string | null>(
      this.data?.branchId ?? null,
      {
        validators: [],
        nonNullable: false,
      }
    ),
    cycleId: this.formTools.builder.control<string | null>(
      this.data?.cycleId ?? null,
      {
        validators: [],
        nonNullable: false,
      }
    ),
  });

  ngOnInit(): void {
    this.branchTools.fetchAll();
    this.cycleTools.fetchAll();

    if (this.data?.id) {
      this.formGroup.get('password')?.clearValidators();
      this.formGroup.get('password')?.updateValueAndValidity();

      this.formGroup
        .get('username')
        ?.valueChanges.pipe(startWith(this.data.username))
        .subscribe((value) => {
          const usernameControl = this.formGroup.get('username');

          if (value === this.data?.username) {
            usernameControl?.clearAsyncValidators();
          } else {
            usernameControl?.setAsyncValidators([this.formTools.isUsernameValid]);
          }
          usernameControl?.updateValueAndValidity({
            onlySelf: true,
            emitEvent: false,
          });
        });
    }
  }

  public submit() {
    if (this.formGroup.valid) {
      this.loading.set(true);
      const values = this.formGroup.getRawValue();

      if (!!this.data?.id) {
        this.updateOneUserGQL
          .mutate({
            variables: {
              id: this.data?.id,
              update: {
                email: values.email,
                username: values.username,
                branchId: values.branchId,
                cycleId: values.cycleId,
              },
            },
          })
          .subscribe({
            next: ({ data }) => {
              this.loading.set(false);
              this._dialogRef.close(data?.updateOneUser);
            },
            error: (error) => {
              this.loading.set(false);
              console.error('Error creating user:', error);
            },
          });
      } else {
        this.createOneUserGQL
          .mutate({
            variables: {
              input: {
                email: values.email,
                username: values.username,
                password: values.password,
                branchId: values.branchId,
                cycleId: values.cycleId,
              },
            },
          })
          .subscribe({
            next: ({ data }) => {
              this.loading.set(false);
              this._dialogRef.close(data?.signUp);
            },
            error: (error) => {
              this.loading.set(false);
              console.error('Error creating user:', error);
            },
          });
      }
    }
  }
}
