# RaosFin - Aplicação Financeira Angular 21

## Descrição Geral

RaosFin é uma aplicação financeira desenvolvida em Angular 21 com arquitetura moderna, utilizando Bootstrap 5 para estilização e PrimeNG para componentes de tabela. A aplicação gerencia usuários, contas, tipos de transação e movimentações financeiras, com autenticação, navegação baseada em rotas e formulários responsivos.

## Stack Tecnológico

- **Frontend**: Angular 21 (Standalone Components)
- **UI Framework**: Bootstrap 5 + PrimeNG
- **State Management**: RxJS (BehaviorSubject)
- **HTTP**: HttpClient com API Service abstrato
- **Routing**: Angular Router com Guards
- **Forms**: Template-driven forms
- **Build Tool**: Angular CLI

## Estrutura do Projeto

```
raosfin/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── menu/
│   │   │   └── select-account/
│   │   ├── services/
│   │   │   ├── api.service.ts
│   │   │   ├── account.service.ts
│   │   │   ├── user.service.ts
│   │   │   ├── financial-transaction.service.ts
│   │   │   └── transaction-type.service.ts
│   │   ├── models/
│   │   │   ├── account.model.ts
│   │   │   ├── user.model.ts
│   │   │   ├── financial-transaction.model.ts
│   │   │   └── transaction-type.model.ts
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   └── account.guard.ts
│   │   ├── accounts/
│   │   │   ├── accounts.component.ts/html/css
│   │   │   └── account-form.component.ts/html/css
│   │   ├── users/
│   │   │   ├── users.component.ts/html/css
│   │   │   └── user-form.component.ts/html/css
│   │   ├── financial-transactions/
│   │   │   ├── financial-transactions.component.ts/html/css
│   │   │   └── financial-transaction-form.component.ts/html/css
│   │   ├── transaction-types/
│   │   │   ├── transaction-types.component.ts/html/css
│   │   │   └── transaction-type-form.component.ts/html/css
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── app.routes.ts
│   │   ├── app.component.ts/html/css
│   │   └── main.ts
│   ├── assets/
│   └── index.html
├── angular.json
├── package.json
└── tsconfig.json
```

## Passo a Passo para Recriação

### 1. Configuração Inicial do Projeto

```bash
# Criar novo projeto Angular 21
ng new raosfin --standalone --routing --style=css --ssr=false

# Navegar para o projeto
cd raosfin

# Instalar dependências
npm install primeng primeicons bootstrap @angular/router rxjs
```

### 2. Configuração do Angular.json

Adicionar Bootstrap e PrimeNG ao angular.json:

```json
{
  "projects": {
    "raosfin": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "node_modules/bootstrap/dist/css/bootstrap.min.css",
              "node_modules/primeng/resources/themes/lara-light-blue/theme.css",
              "node_modules/primeng/resources/primeng.min.css",
              "node_modules/primeicons/primeicons.css",
              "src/styles.css"
            ],
            "scripts": [
              "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
            ]
          }
        }
      }
    }
  }
}
```

### 3. Models (Interfaces TypeScript)

#### user.model.ts
```typescript
export interface User {
  id?: number;
  active: boolean;
  name: string;
  email: string;
  password: string;
}
```

#### account.model.ts
```typescript
export interface Account {
  id?: number;
  active: boolean;
  name: string;
  balance: number;
  userId: number;
}
```

#### transaction-type.model.ts
```typescript
export type TransactionType = 'CREDIT' | 'DEBIT';

export interface TransactionTypeModel {
  id?: number;
  active: boolean;
  name: string;
  value: number;
  type: TransactionType;
  installments: number;
  dueDate: number;
  monthlyMovement: boolean;
  userId: number;
}
```

#### financial-transaction.model.ts
```typescript
export type TransactionStatus = 'PENDING' | 'PAID';

export interface FinancialTransaction {
  id?: number;
  userId: number;
  accountId: number;
  transactionTypeId: number;
  status: TransactionStatus;
  dueDate: string;
  value: number;
}
```

### 4. Services (Camada de Dados)

#### api.service.ts (Service Base)
```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.baseUrl}/${endpoint}`);
  }

  getById<T>(endpoint: string, id: number): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}/${id}`);
  }

  getByUserId<T>(endpoint: string, userId: number): Observable<T[]> {
    return this.http.get<T[]>(`${this.baseUrl}/${endpoint}/user/${userId}`);
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data);
  }

  put<T>(endpoint: string, id: number, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}/${id}`, data);
  }

  delete(endpoint: string, id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${endpoint}/${id}`);
  }
}
```

#### user.service.ts
```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private endpoint = 'users';

  constructor(private apiService: ApiService) {}

  getAll(): Observable<User[]> {
    return this.apiService.get<User>(this.endpoint);
  }

  getById(id: number): Observable<User> {
    return this.apiService.getById<User>(this.endpoint, id);
  }

  create(user: User): Observable<User> {
    return this.apiService.post<User>(this.endpoint, user);
  }

  update(id: number, user: User): Observable<User> {
    return this.apiService.put<User>(this.endpoint, id, user);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete(this.endpoint, id);
  }
}
```

#### account.service.ts
```typescript
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { Account } from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private endpoint = 'accounts';
  private activeAccountSubject = new BehaviorSubject<Account | null>(null);
  activeAccount$ = this.activeAccountSubject.asObservable();

  constructor(private apiService: ApiService) {}

  getAll(): Observable<Account[]> {
    return this.apiService.get<Account>(this.endpoint);
  }

  getByUserId(userId: number): Observable<Account[]> {
    return this.apiService.getByUserId<Account>(this.endpoint, userId);
  }

  getById(id: number): Observable<Account> {
    return this.apiService.getById<Account>(this.endpoint, id);
  }

  create(account: Account): Observable<Account> {
    return this.apiService.post<Account>(this.endpoint, account);
  }

  update(id: number, account: Account): Observable<Account> {
    return this.apiService.put<Account>(this.endpoint, id, account);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete(this.endpoint, id);
  }

  setActiveAccount(account: Account): void {
    this.activeAccountSubject.next(account);
    sessionStorage.setItem('activeAccount', JSON.stringify(account));
  }

  getActiveAccount(): Observable<Account | null> {
    const stored = sessionStorage.getItem('activeAccount');
    if (stored && !this.activeAccountSubject.value) {
      this.activeAccountSubject.next(JSON.parse(stored));
    }
    return this.activeAccount$;
  }

  clearActiveAccount(): void {
    this.activeAccountSubject.next(null);
    sessionStorage.removeItem('activeAccount');
  }
}
```

### 5. Guards (Proteção de Rotas)

#### auth.guard.ts
```typescript
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('authToken');
    if (token) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
```

#### account.guard.ts
```typescript
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AccountService } from '../services/account.service';

@Injectable({
  providedIn: 'root'
})
export class AccountGuard implements CanActivate {
  
  constructor(
    private accountService: AccountService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const activeAccount = sessionStorage.getItem('activeAccount');
    if (activeAccount) {
      return true;
    } else {
      this.router.navigate(['/select-account']);
      return false;
    }
  }
}
```

### 6. Padrão de Componentes

Cada módulo segue o mesmo padrão:

1. **Componente de Listagem**: PrimeNG Table + Bootstrap
2. **Componente de Formulário**: Bootstrap + Router
3. **Navegação**: Baseada em rotas com parâmetros ID

#### Exemplo: Componente de Listagem (Users)

##### users.component.ts
```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, CardModule, ToastModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  providers: [MessageService]
})
export class UsersComponent implements OnInit {
  
  users: User[] = [];
  loading: boolean = false;
  
  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUsers();
  }
  
  loadUsers() {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erro', 
          detail: 'Erro ao carregar usuários' 
        });
        this.loading = false;
      }
    });
  }
  
  addNewUser() {
    this.router.navigate(['/users/new']);
  }
  
  editUser(user: User) {
    this.router.navigate(['/users', user.id, 'edit']);
  }
  
  delete(user: User) {
    this.userService.delete(user.id!).subscribe({
      next: () => {
        this.loadUsers();
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Sucesso', 
          detail: 'Usuário excluído com sucesso' 
        });
      },
      error: (error) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erro', 
          detail: 'Erro ao excluir usuário' 
        });
      }
    });
  }
}
```

##### users.component.html
```html
<div class="container-fluid py-4">
  <div class="row mb-4">
    <div class="col-12">
      <p-card>
        <div class="d-flex justify-content-between align-items-center m-3">
          <h5 class="mb-0 text-muted">Lista de usuários</h5>
          <button class="btn btn-primary" (click)="addNewUser()">
            <i class="pi pi-plus"></i>
            Novo Usuário
          </button>
        </div>

        <div class="m-3">
          <p-table [value]="users" [paginator]="true" [rows]="10" 
                   responsiveLayout="scroll" [loading]="loading"
                   [scrollable]="true" scrollHeight="400px">
            <ng-template pTemplate="header">
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th style="width: 100px">Status</th>
                <th style="width: 120px">Ações</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-user>
              <tr>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <span [class]="user.active ? 'badge bg-success' : 'badge bg-danger'" 
                        class="px-2 py-1 rounded-pill">
                    {{ user.active ? 'Ativo' : 'Inativo' }}
                  </span>
                </td>
                <td>
                  <div role="group">
                    <button class="btn btn-primary mb-2" (click)="editUser(user)">
                      <span class="pi pi-pencil"></span>
                    </button>
                    <button class="btn btn-danger ms-2 mb-2" (click)="delete(user)">
                      <span class="pi pi-trash"></span>
                    </button>
                  </div>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </p-card>
    </div>
  </div>
  
  <p-toast position="top-right" />
</div>
```

#### Exemplo: Componente de Formulário (Users)

##### user-form.component.ts
```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
  providers: [MessageService]
})
export class UserFormComponent implements OnInit, OnDestroy {
  
  user: User = { 
    name: '', 
    email: '', 
    password: '', 
    active: true 
  };
  
  isEditMode: boolean = false;
  loading: boolean = false;
  private routeSub: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      
      if (id) {
        this.isEditMode = true;
        this.loadUser(parseInt(id));
      } else {
        this.isEditMode = false;
        this.resetForm();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  private loadUser(id: number): void {
    this.loading = true;
    this.userService.getById(id).subscribe({
      next: (user) => {
        this.user = { ...user };
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar usuário'
        });
        this.loading = false;
        this.router.navigate(['/users']);
      }
    });
  }

  private resetForm(): void {
    this.user = { 
      name: '', 
      email: '', 
      password: '', 
      active: true 
    };
  }

  save(): void {
    // Validações
    if (!this.user.name || this.user.name.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Nome do usuário é obrigatório'
      });
      return;
    }

    if (this.user.name.length > 100) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Nome deve ter no máximo 100 caracteres'
      });
      return;
    }

    if (!this.user.email || this.user.email.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Email do usuário é obrigatório'
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.user.email)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Email inválido'
      });
      return;
    }

    if (!this.isEditMode) {
      if (!this.user.password || this.user.password.trim() === '') {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Senha é obrigatória'
        });
        return;
      }

      if (this.user.password.length < 6) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Senha deve ter no mínimo 6 caracteres'
        });
        return;
      }
    }

    this.loading = true;

    if (this.isEditMode) {
      this.userService.update(this.user.id!, this.user).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Usuário atualizado com sucesso'
          });
          this.loading = false;
          this.router.navigate(['/users']);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao atualizar usuário'
          });
          this.loading = false;
        }
      });
    } else {
      this.userService.create(this.user).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Usuário criado com sucesso'
          });
          this.loading = false;
          this.router.navigate(['/users']);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao criar usuário'
          });
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/users']);
  }

  get title(): string {
    return this.isEditMode ? 'Editar Usuário' : 'Novo Usuário';
  }
}
```

### 7. Configuração de Rotas

#### app.routes.ts
```typescript
import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AccountGuard } from './guards/account.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'select-account',
    loadComponent: () => import('./components/select-account/select-account.component').then(c => c.SelectAccountComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent),
    canActivate: [AuthGuard, AccountGuard]
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
  // Repetir padrão para accounts, transaction-types, financial-transactions
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
```

### 8. Padrões Arquiteturais

#### 1. Standalone Components
- Todos os componentes são standalone (Angular 15+)
- Imports declarados individualmente
- Melhor performance e tree-shaking

#### 2. Route-based Navigation
- Formulários em páginas dedicadas (sem modais)
- URLs amigáveis: `/users/new`, `/users/:id/edit`
- Melhor UX e SEO

#### 3. Service Layer Pattern
- ApiService abstrai comunicação HTTP
- Services específicos herdam do ApiService
- Separação clara de responsabilidades

#### 4. State Management com RxJS
- BehaviorSubject para estado global
- SessionStorage para persistência
- Reativo e tipado

#### 5. Guards de Autenticação
- AuthGuard: protege rotas que exigem login
- AccountGuard: protege rotas que exigem conta ativa

### 9. Validações e Regras de Negócio

#### Users
- Nome: obrigatório, max 100 caracteres
- Email: obrigatório, formato válido, max 100 caracteres
- Senha: obrigatória apenas criação, min 6 caracteres
- Status: ativo/inativo

#### Accounts
- Nome: obrigatório, max 100 caracteres
- Saldo: obrigatório, max 99.999.999,99
- Status: ativo/inativo

#### Transaction Types
- Nome: obrigatório, max 100 caracteres
- Valor: obrigatório, max 99.999.999,99
- Tipo: Débito/Crédito
- Parcelas: 1-999
- Dia vencimento: 1-31

#### Financial Transactions
- Valor: obrigatório, max 99.999.999,99
- Data vencimento: obrigatória
- Status: Pendente/Pago

### 10. Deploy e Produção

#### Build para Produção
```bash
ng build --configuration production
```

#### Variáveis de Ambiente
- Desenvolvimento: `http://localhost:8080/api`
- Produção: configurar URL da API real

## Resumo

Este documento descreve completamente a arquitetura da aplicação RaosFin, incluindo:

- **Stack tecnológico**: Angular 21 + Bootstrap 5 + PrimeNG
- **Padrão arquitetural**: Componentes standalone, navegação baseada em rotas, service layer
- **Estrutura modular**: 4 módulos principais (Users, Accounts, Transaction Types, Financial Transactions)
- **Padrão consistente**: Todos os módulos seguem a mesma estrutura de listagem + formulário
- **Validações**: Regras de negócio implementadas client-side
- **Segurança**: Guards de autenticação e proteção de rotas
- **Estado global**: RxJS + SessionStorage para conta ativa

A aplicação está pronta para uso com frontend completo e arquitetura escalável.
