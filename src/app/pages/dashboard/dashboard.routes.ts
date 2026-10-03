import { Routes } from '@angular/router';

export const DashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'students',
    loadComponent: () =>
      import('./students/students.component').then((m) => m.StudentsComponent),
  },
  {
    path: 'teachers',
    loadComponent: () =>
      import('./teachers/teachers.component').then((m) => m.TeachersComponent),
  },
  {
    path: 'payments',
    loadComponent: () =>
      import('./payments/payments.component').then((m) => m.PaymentsComponent),
  },
  {
    path: 'enrollments',
    loadComponent: () =>
      import('./enrollments/enrollments.component').then(
        (m) => m.EnrollmentsComponent,
      ),
  },
  {
    path: 'cycles',
    loadComponent: () =>
      import('./cycles/cycles.component').then((m) => m.CyclesComponent),
  },
  {
    path: 'levels',
    loadComponent: () =>
      import('./levels/levels.component').then((m) => m.LevelsComponent),
  },
  {
    path: 'prices',
    loadComponent: () =>
      import('./prices/prices.component').then((m) => m.PricesComponent),
  },
  {
    path: 'disciplines',
    loadComponent: () =>
      import('./disciplines/disciplines.component').then(
        (m) => m.DisciplinesComponent,
      ),
  },
  {
    path: 'calendars',
    loadComponent: () =>
      import('./calendars/calendar-page.component').then(
        (m) => m.CalendarPageComponent,
      ),
  },
  {
    path: 'discounts',
    loadComponent: () =>
      import('./discounts/discounts.component').then(
        (m) => m.DiscountsComponent,
      ),
  },
  {
    path: 'branches',
    loadComponent: () =>
      import('./branches/branches.component').then((m) => m.BranchsComponent),
  },
  {
    path: 'clip-accounts',
    loadComponent: () =>
      import('./clip-accounts/clip-accounts.component').then(
        (m) => m.ClipAccountsComponent,
      ),
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./users/users.component').then((m) => m.UsersComponent),
  },
  {
    path: 'policies',
    loadComponent: () =>
      import('./policies/policies.component').then((m) => m.PoliciesComponent),
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('./reports/reports.routes').then((m) => m.ReportsRoutes),
  },
];
