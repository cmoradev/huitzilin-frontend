import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreateAction } from '@graphql';
import {
  NavItem,
  Permission,
  PermissionKey,
  navItems,
  permissions,
} from '@routes';
import { BranchToolsService } from '@services';
import { concatMap, groupBy, mergeMap, of, toArray, zip } from 'rxjs';
import {
  form,
  FormField,
  FormRoot,
  required,
} from '@angular/forms/signals';
import { ActionFormFields } from '@app/types/permissions';

@Component({
  selector: 'app-action-form',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    FormField,
    FormRoot,
  ],
  templateUrl: './action-form.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class ActionFormComponent implements OnInit {
  protected branchTools = inject(BranchToolsService);

  public save = output<CreateAction[]>();

  protected navigations: NavItem[] = [];
  private readonly _allPermissions: Permission[] = permissions;

  public readonly actionModel = signal<ActionFormFields>({
    id: null,
    route: '',
    actions: [],
    resources: [],
  });

  public readonly actionForm = form(this.actionModel, (schema) => {
    required(schema.route, { message: 'Campo requerido' });
    required(schema.actions, { message: 'Seleccione al menos una acción' });
    required(schema.resources, {
      message: 'Seleccione al menos una sucursal',
    });
  });

  protected readonly currentRoute = computed(() => this.actionModel().route);

  protected readonly isGlobalRoute = computed(() => {
    const route = navItems.find((item) => item.route === this.currentRoute());
    return !!route?.isGlobal;
  });

  protected readonly permissions = computed(() => {
    const route = this.currentRoute() || 'notFound';
    return this._allPermissions.filter((p) => p.route === route);
  });

  constructor() {
    // Restablece valores derivados al cambiar la ruta.
    effect(() => {
      const route = this.actionModel().route;
      const routeItem = navItems.find((item) => item.route === route);

      if (!route) {
        return;
      }

      this.actionModel.update((m) => ({
        ...m,
        actions: [],
        resources: routeItem?.isGlobal ? ['*'] : [],
      }));
    });
  }

  ngOnInit(): void {
    this.branchTools.fetchAll();

    of(navItems)
      .pipe(
        concatMap((res) => res),
        groupBy((item) => item.section),
        mergeMap((group) => zip(of(group.key), group.pipe(toArray())))
      )
      .subscribe((grouped) => {
        const [section, routes] = grouped;

        this.navigations.push({ section, routes });
      });
  }

  public togglePermission(permission: PermissionKey, checked: boolean): void {
    this.actionModel.update((m) => {
      const has = m.actions.includes(permission);
      if (checked && !has) {
        return { ...m, actions: [...m.actions, permission] };
      }
      if (!checked && has) {
        return {
          ...m,
          actions: m.actions.filter((p) => p !== permission),
        };
      }
      return m;
    });
  }

  public saveData(): void {
    if (this.actionForm().invalid()) {
      return;
    }

    const values = this.actionModel();
    console.log(values);
  }
}