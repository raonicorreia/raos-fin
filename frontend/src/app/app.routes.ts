import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AccountGuard } from './guards/account.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'select-account',
    loadComponent: () => import('./components/select-account/select-account.component').then(c => c.SelectAccountComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent),
    canActivate: [AccountGuard]
  },
  {
    path: 'users',
    loadComponent: () => import('./users/users.component').then(c => c.UsersComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'users/new',
    loadComponent: () => import('./users/user-form.component').then(c => c.UserFormComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'users/:id/edit',
    loadComponent: () => import('./users/user-form.component').then(c => c.UserFormComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'accounts',
    loadComponent: () => import('./accounts/accounts.component').then(c => c.AccountsComponent),
    canActivate: [AccountGuard]
  },
  {
    path: 'accounts/new',
    loadComponent: () => import('./accounts/account-form.component').then(c => c.AccountFormComponent),
    canActivate: [AccountGuard]
  },
  {
    path: 'accounts/new-from-selection',
    loadComponent: () => import('./accounts/account-form.component').then(c => c.AccountFormComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'accounts/:id/edit',
    loadComponent: () => import('./accounts/account-form.component').then(c => c.AccountFormComponent),
    canActivate: [AccountGuard]
  },
  {
    path: 'transaction-types',
    loadComponent: () => import('./transaction-types/transaction-types.component').then(c => c.TransactionTypesComponent),
    canActivate: [AccountGuard]
  },
  {
    path: 'transaction-types/new',
    loadComponent: () => import('./transaction-types/transaction-type-form.component').then(c => c.TransactionTypeFormComponent),
    canActivate: [AccountGuard]
  },
  {
    path: 'transaction-types/:id/edit',
    loadComponent: () => import('./transaction-types/transaction-type-form.component').then(c => c.TransactionTypeFormComponent),
    canActivate: [AccountGuard]
  },
  {
    path: 'financial-transactions',
    loadComponent: () => import('./financial-transactions/financial-transactions.component').then(c => c.FinancialTransactionsComponent),
    canActivate: [AccountGuard]
  },
  {
    path: 'financial-transactions/new',
    loadComponent: () => import('./financial-transactions/financial-transaction-form.component').then(c => c.FinancialTransactionFormComponent),
    canActivate: [AccountGuard]
  },
  {
    path: 'financial-transactions/:id/edit',
    loadComponent: () => import('./financial-transactions/financial-transaction-form.component').then(c => c.FinancialTransactionFormComponent),
    canActivate: [AccountGuard]
  },
  {
    path: 'monthly-import',
    loadComponent: () => import('./monthly-import/monthly-import.component').then(c => c.MonthlyImportComponent),
    canActivate: [AccountGuard]
  }
];