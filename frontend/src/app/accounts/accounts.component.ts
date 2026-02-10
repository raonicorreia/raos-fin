import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Account } from '../models/account.model';
import { AccountService } from '../services/account.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TableModule],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent implements OnInit {
  
  accounts: Account[] = [];
  loading: boolean = false;
  currentUser: any;
  
  constructor(
    private accountService: AccountService,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
  ) {
    console.log('AccountsComponent constructor called');
  }
  
  ngOnInit() {
    this.currentUser = this.authService.getCurrentUserSync();
    this.loadAccounts();
  }
  
  loadAccounts() {
    this.loading = true;
    this.accountService.getByUserId(this.currentUser.userId).subscribe({
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
  
  addNewAccount() {
    this.router.navigate(['/accounts/new']);
  }
  
  editAccount(account: Account) {
    this.router.navigate(['/accounts', account.id, 'edit']);
  }
  
  delete(account: Account) {
    console.log('Delete method called for account:', account.id);
    this.accountService.delete(account.id!).subscribe({
      next: () => {
        console.log('Account deleted successfully');
        this.loadAccounts();
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Conta excluída com sucesso' });
      },
      error: (error) => {
        console.error('Error deleting account:', error);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir conta' });
      }
    });
  }
}
