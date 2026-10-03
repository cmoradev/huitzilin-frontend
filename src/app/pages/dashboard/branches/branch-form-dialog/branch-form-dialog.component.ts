import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ImagePickerComponent } from '@components/image-picker/image-picker.component';
import {
  BranchPartsFragment,
  CreateOneBranchGQL,
  UpdateOneBranchGQL,
} from '@graphql';
import {
  ClipAccountToolsService,
  FormToolsService,
  StorageService,
} from '@services';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-form-dialog',
  imports: [
    MatDialogModule,
    MatButton,
    MatFormFieldModule,
    MatInputModule,
    ImagePickerComponent,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  templateUrl: './branch-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class BranchFormDialogComponent implements OnInit {
  public readonly formTools = inject(FormToolsService);

  public loading = signal(false);
  public data: BranchPartsFragment | null = inject(MAT_DIALOG_DATA);
  public readonly _storage = inject(StorageService);

  private readonly _createOneBranch = inject(CreateOneBranchGQL);
  private readonly _updateOneBranch = inject(UpdateOneBranchGQL);

  private readonly _dialogRef = inject(MatDialogRef<BranchFormDialogComponent>);

  public clipAccountTools = inject(ClipAccountToolsService);

  private previusPicture = '';

  public formGroup = this.formTools.builder.group({
    picture: this.formTools.builder.control<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    name: this.formTools.builder.control<string>('', {
      validators: [Validators.required, Validators.maxLength(16)],
      nonNullable: true,
    }),
    clipAccountID: this.formTools.builder.control<string | null>(null, {
      validators: [],
      nonNullable: false,
    }),
  });

  ngOnInit(): void {
    this.clipAccountTools.fetchAll();

    if (!!this.data?.id) {
      const clipAccount = this.data.clipAccounts.find(() => true);

      this.formGroup.get('picture')?.clearValidators();

      this.formGroup.patchValue({
        name: this.data.name,
        picture: this.data.picture,
      });

      if (!!clipAccount) {
        this.formGroup.get('clipAccountID')?.setValue(clipAccount.id);
      }

      this.previusPicture = this.data.picture;
      this.formGroup.get('picture')?.updateValueAndValidity();
    }
  }

  public async submit(): Promise<void> {
    if (this.formGroup.valid) {
      this.loading.set(true);

      const values = this.formGroup.getRawValue() as any;

      if (!!this.data?.id) {
        this._update(values).subscribe({
          next: (branch) => {
            this._dialogRef.close(branch);
          },
          error: (err) => {
            console.error('UPDATE BRANCH ERROR: ', err);
          },
          complete: () => {
            this.loading.set(false);
          },
        });
      } else {
        this._save(values).subscribe({
          next: (branch) => {
            this._dialogRef.close(branch);
          },
          error: (err) => {
            console.error('CREATE BRANCH ERROR: ', err);
          },
          complete: () => {
            this.loading.set(false);
          },
        });
      }
    }
  }

  private _update(values: FormValues) {
    if (values.picture instanceof File) {
      return this._storage.delete(this.previusPicture).pipe(
        switchMap(() => this._storage.upload(values.picture)),
        switchMap((picture) =>
          this._updateOneBranch.mutate({
            variables: {
              id: this.data!.id,
              update: { ...values, picture },
            },
          })
        ),
        map((value) => value.data?.updateOneBranch)
      );
    }

    return this._updateOneBranch
      .mutate({
        variables: {
          id: this.data!.id,
          update: {
            name: values.name,
            picture: values.picture,
            clipAccounts: values?.clipAccountID
              ? [{ id: values.clipAccountID }]
              : [],
          } as any,
        },
      })
      .pipe(map((value) => value.data?.updateOneBranch));
  }

  private _save(values: FormValues) {
    return this._storage.upload(values.picture).pipe(
      switchMap((picture) =>
        this._createOneBranch.mutate({
          variables: {
            branch: {
              picture,
              name: values.name,
              clipAccounts: values?.clipAccountID
                ? [{ id: values.clipAccountID }]
                : [],
            },
          },
        })
      ),
      map((value) => value.data?.createOneBranch)
    );
  }
}

type FormValues = {
  picture: File;
  name: string;
  clipAccountID: string | null;
};
