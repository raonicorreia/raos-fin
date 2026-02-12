import { Component, OnInit, OnDestroy } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FinancialTransaction } from '../models/financial-transaction.model';
import { FinancialTransactionService } from '../services/financial-transaction.service';
import { AccountService } from '../services/account.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AvailableAmountService } from '../services/avaiable-amount.service';

type TransactionStatus = 'PENDING' | 'PAID';

@Component({
  selector: 'app-financial-transactions',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TableModule],
  templateUrl: './financial-transactions.component.html',
  styleUrl: './financial-transactions.component.css'
})
export class FinancialTransactionsComponent implements OnInit, OnDestroy {
  
  transactions: FinancialTransaction[] = [];
  loading: boolean = false;
  activeAccount: any = null;
  private accountSubscription: Subscription | null = null;
  
  statusOptions = [
    { label: 'Pendente', value: 'PENDING' as TransactionStatus },
    { label: 'Pago', value: 'PAID' as TransactionStatus }
  ];
  
  constructor(
    private financialTransactionService: FinancialTransactionService,
    private accountService: AccountService,
    private messageService: MessageService,
    private availableAmountState: AvailableAmountService,
    private router: Router
  ) {
    console.log('FinancialTransactionsComponent constructor called');
  }
  
  ngOnInit() {
    this.accountSubscription = this.accountService.getActiveAccount().subscribe(account => {
      this.activeAccount = account;
      if (account) {
        this.loadTransactions();
      }
    });
  }
  
  loadTransactions() {
    if (!this.activeAccount) {
      return;
    }

    this.loading = true;
    // Mock: filtrando por conta ativa - substituir com chamada real à API
    this.financialTransactionService.getByUserId(this.activeAccount.userId || 1).subscribe({
      next: (data) => {
        // Filtrando transações pela conta ativa
        this.transactions = data.filter(transaction => 
          transaction.accountId === this.activeAccount.id
        );
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erro', 
          detail: 'Erro ao carregar movimentações financeiras' 
        });
        this.loading = false;
        console.error('Error loading financial transactions:', error);
      }
    });
  }
  
  addNewTransaction() {
    this.router.navigate(['/financial-transactions/new']);
  }
  
  editTransaction(transaction: FinancialTransaction) {
    this.router.navigate(['/financial-transactions', transaction.id, 'edit']);
  }
  
  markAsPaid(transaction: FinancialTransaction) {
    console.log('Mark as paid method called for transaction:', transaction.id);
    this.financialTransactionService.markAsPaid(transaction.id!).subscribe({
      next: () => {
        console.log('Transaction marked as paid successfully');
        this.loadTransactions();
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Movimentação marcada como paga' });
        this.availableAmountState.getAvailableAmount();
      },
      error: (error) => {
        console.error('Error marking transaction as paid:', error);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao marcar movimentação como paga' });
      }
    });
  }
  
  delete(transaction: FinancialTransaction) {
    console.log('Delete method called for transaction:', transaction.id);
    this.financialTransactionService.delete(transaction.id!).subscribe({
      next: () => {
        console.log('Transaction deleted successfully');
        this.loadTransactions();
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Movimentação excluída com sucesso' });
        this.availableAmountState.getAvailableAmount();
      },
      error: (error) => {
        console.error('Error deleting transaction:', error);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir movimentação' });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.accountSubscription) {
      this.accountSubscription.unsubscribe();
    }
  }
}
