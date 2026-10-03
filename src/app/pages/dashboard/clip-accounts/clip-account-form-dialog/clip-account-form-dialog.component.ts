import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  ClipAccountPartsFragment,
  CreateClipAccount,
  CreateOneClipAccountGQL,
  UpdateClipAccount,
  UpdateOneClipAccountGQL,
} from '@graphql';
import { FormToolsService } from '@services';
import { map } from 'rxjs';

@Component({
  selector: 'app-clip-account-form-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './clip-account-form-dialog.component.html',
  styles: ``,
})
export class ClipAccountFormDialogComponent {
  public readonly formTools = inject(FormToolsService);

  public loading = signal<boolean>(false);
  public data: ClipAccountPartsFragment | null = inject(MAT_DIALOG_DATA);

  private readonly _createOneClipAccount = inject(CreateOneClipAccountGQL);
  private readonly _updateOneClipAccount = inject(UpdateOneClipAccountGQL);

  private readonly _dialogRef = inject(
    MatDialogRef<ClipAccountFormDialogComponent>
  );

  public formGroup = this.formTools.builder.group({
    name: this.formTools.builder.control<string>('', {
      validators: [Validators.required, Validators.maxLength(64)],
      nonNullable: true,
    }),
    token: this.formTools.builder.control<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    webhook: this.formTools.builder.control<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    default: this.formTools.builder.control<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    success: this.formTools.builder.control<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    error: this.formTools.builder.control<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  ngOnInit(): void {
    if (!!this.data?.id) {
      this.formGroup.patchValue({
        name: this.data.name,
        webhook: this.data.webhook,
        success: this.data.success,
        default: this.data.default,
        error: this.data.error,
      });

      this.formGroup.get('token')?.clearValidators();
      this.formGroup.get('token')?.updateValueAndValidity();
    }
  }

  public async submit(): Promise<void> {
    if (this.formGroup.valid) {
      this.loading.set(true);

      const values = this.formGroup.getRawValue();

      if (!!this.data?.id) {
        const payload: UpdateClipAccount = {
          name: values.name,
          
        };

        if (values.token !== '') {
          payload.token = values.token;
        }

        this._update(payload).subscribe({
          next: (cycle) => {
            this._dialogRef.close(cycle);
          },
          error: (err) => {
            console.error('UPDATE CYCLE ERROR: ', err);
          },
          complete: () => {
            this.loading.set(false);
          },
        });
      } else {
        this._save(values).subscribe({
          next: (cycle) => {
            this._dialogRef.close(cycle);
          },
          error: (err) => {
            console.error('CREATE CYCLE ERROR: ', err);
          },
          complete: () => {
            this.loading.set(false);
          },
        });
      }
    }
  }

  private _update(values: UpdateClipAccount) {
    return this._updateOneClipAccount
      .mutate({
        variables: {
          id: this.data!.id,
          update: {
            ...values,
          },
        },
      })
      .pipe(map((value) => value.data?.updateOneClipAccount));
  }

  private _save(values: CreateClipAccount) {
    return this._createOneClipAccount
      .mutate({
        variables: {
          account: {
            ...values,
          },
        },
      })
      .pipe(map((value) => value.data?.createOneClipAccount));
  }
}
