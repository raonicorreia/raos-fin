import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';
import { Account } from '../../models/account.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select-account',
  standalone: true,
  imports: [
    CardModule,
    MessageModule,
    CommonModule
  ],
  templateUrl: './select-account.component.html',
  styleUrl: './select-account.component.css'
})
export class SelectAccountComponent implements OnInit {
  accounts: Account[] = [];
  loading: boolean = false;
  currentUser: any;

  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUserSync();
    
    // Verifica se está retornando da criação de conta para recarregar a lista
    const returningFromAccountCreation = sessionStorage.getItem('returningFromAccountCreation');
    if (returningFromAccountCreation) {
      sessionStorage.removeItem('returningFromAccountCreation');
      // Força recarregamento das contas para incluir a nova conta criada
      this.loadAccounts();
    } else {
      this.loadAccounts();
    }
  }

  loadAccounts(): void {
    this.loading = true;

    this.accountService.getByUserId(1).subscribe({ // Usando userId 1 como exemplo
      next: (data) => {
        this.accounts = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erro', 
          detail: 'Erro ao carregar contas' 
        });
        this.loading = false;
        console.error('Error loading accounts:', error);
      }
    });
  }

  selectAccount(account: Account): void {
    // Primeiro define a conta ativa
    this.accountService.setActiveAccount(account);
    
    // Mostra mensagem de sucesso
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `Conta "${account.name}" selecionada com sucesso!`
    });
    
    // Navega imediatamente (o guard agora usa Observable e vai esperar)
    this.router.navigate(['/dashboard']);
  }

  createNewAccount(): void {
    // Armazena a rota de retorno para saber para onde voltar após criar a conta
    sessionStorage.setItem('returnUrl', '/select-account');
    // Redireciona para o formulário de nova conta usando a rota que não exige AccountGuard
    this.router.navigate(['/accounts/new-from-selection']);
  }

  logout(): void {
    this.authService.logout();
    this.accountService.clearActiveAccount();
    this.router.navigate(['/login']);
  }
}
