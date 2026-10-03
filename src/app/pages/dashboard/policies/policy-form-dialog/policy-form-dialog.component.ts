import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  CreateAction,
  CreateOnePolicyGQL,
  PolicyPartsFragment,
  UpdateOnePolicyGQL,
} from '@graphql';
import {
  form,
  FormField,
  FormRoot,
  minLength,
  required,
} from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { ActionFormComponent } from '../action-form/action-form.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { PolicyFormFields } from '@app/types/policies';

@Component({
  selector: 'app-policy-form-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatExpansionModule,
    MatTooltipModule,
    MatIconModule,
    MatChipsModule,
    FormField,
    FormRoot,
  ],
  templateUrl: './policy-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class PolicyFormDialogComponent {
  public loading = signal<boolean>(false);
  public data = inject<PolicyPartsFragment | null>(MAT_DIALOG_DATA);

  private readonly _dialog = inject(MatDialog);
  private readonly _dialogRef = inject(MatDialogRef<PolicyFormDialogComponent>);
  private readonly _createOnePolicy = inject(CreateOnePolicyGQL);
  private readonly _updateOnePolicy = inject(UpdateOnePolicyGQL);

  public readonly actions = signal<CreateAction[]>([]);

  public readonly isEditing = computed(() => !!this.data?.id);

  private readonly _initialModel = computed<PolicyFormFields>(() => ({
    name: this.data?.name ?? '',
  }));

  public readonly policyModel = linkedSignal<PolicyFormFields, PolicyFormFields>({
    source: this._initialModel,
    computation: (initial) => ({ ...initial }),
  });

  public readonly policyForm = form(this.policyModel, (schema) => {
    required(schema.name, { message: 'Campo requerido' });
    minLength(schema.name, 4, { message: 'Mínimo 4 caracteres' });
  });

  constructor() {
    effect(() => {
      this._dialogRef.disableClose = this.loading();
    });
  }

  public submitPermission(value: CreateAction[]) {
    console.log(value);
  }

  public async submit(): Promise<void> {
    if (this.policyForm().invalid()) {
      return;
    }

    const values = this.policyModel();
    this.loading.set(true);

    try {
      if (this.isEditing()) {
        const updated = await firstValueFrom(
          this._updateOnePolicy.mutate({
            variables: {
              id: this.data!.id,
              update: {
                name: values.name,
                actions: this.actions(),
              },
            },
          })
        );

        this._dialogRef.close(updated.data?.updateOnePolicy);
      } else {
        const created = await firstValueFrom(
          this._createOnePolicy.mutate({
            variables: {
              policy: {
                name: values.name,
                actions: this.actions(),
              },
            },
          })
        );

        this._dialogRef.close(created.data?.createOnePolicy);
      }
    } catch (err) {
      console.error('Error guardando política:', err);
    } finally {
      this.loading.set(false);
    }
  }

  public openActionForm(): void {
    const dialog$ = this._dialog.open(ActionFormComponent, {
      width: '32rem',
      disableClose: true,
    });
  }
}