import { Component, inject, OnInit, output, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreateAction } from '@graphql';
import { NavItem, navItems, Permission, permissions } from '@routes';
import { BranchToolsService, FormToolsService } from '@services';
import { concatMap, groupBy, mergeMap, of, toArray, zip } from 'rxjs';

@Component({
  selector: 'app-action-form',
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  templateUrl: './action-form.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class ActionFormComponent implements OnInit {
  protected formTools = inject(FormToolsService);
  protected branchTools = inject(BranchToolsService);

  public save = output<CreateAction[]>();

  protected navigations: NavItem[] = [];
  private _permission: Permission[] = permissions;

  protected formGroup = this.formTools.builder.group({
    id: this.formTools.builder.control<string | null>(null, {
      nonNullable: false,
    }),
    route: this.formTools.builder.control<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    actions: this.formTools.builder.array<string>([], {
      validators: [Validators.required],
    }),
    resources: this.formTools.builder.control<string[]>([], {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

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

    this.formGroup.get('route')?.valueChanges.subscribe({
      next: (value) => {
        const route = navItems.find((item) => item.route === value);

        this.formGroup.get('actions')?.setValue([]);

        if (!!route) {
          this.formGroup
            .get('resources')
            ?.setValue(route.isGlobal ? ['*'] : []);
        }
      },
    });
  }

  public saveData() {
    if (this.formGroup.valid) {
      const values = this.formGroup.getRawValue();
      console.log(values);

      // if (this.isGlobalRoute) {
      //   this.save.emit([
      //     {
      //       id: values.id,
      //       actions: values.actions,
      //       resources: '*',
      //       route: values.route,
      //     },
      //   ]);
      // } else {
      //   this.save.emit(
      //     values.resources.map((resource) => ({
      //       id: values.id,
      //       actions: values.actions,
      //       resources: resource,
      //       route: values.route,
      //     }))
      //   );
      // }
    }
  }

  get withRoute() {
    return !!this.formGroup.get('route')?.value;
  }

  get isGlobalRoute() {
    const route = navItems.find(
      (item) => item.route === this.formGroup.get('route')?.value
    );

    return !!route?.isGlobal;
  }

  get permissions() {
    const route = this.formGroup.get('route')?.value || 'notFound';

    return this._permission.filter((permission) => permission.route === route);
  }
}

export type PermissionFormValues = {
  id: string | null;
  route: string;
  actions: string[];
  resources: string[];
};
