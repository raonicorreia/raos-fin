import { Component, OnInit, OnDestroy } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { TransactionTypeModel } from '../models/transaction-type.model';
import { TransactionTypeService } from '../services/transaction-type.service';
import { AccountService } from '../services/account.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

type TransactionType = 'CREDIT' | 'DEBIT';

@Component({
  selector: 'app-transaction-types',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TableModule],
  templateUrl: './transaction-types.component.html',
  styleUrl: './transaction-types.component.css'
})
export class TransactionTypesComponent implements OnInit, OnDestroy {
  
  transactionTypes: TransactionTypeModel[] = [];
  loading: boolean = false;
  activeAccount: any = null;
  availableAmount: number = 0;
  private accountSubscription: Subscription | null = null;
  
  transactionTypeOptions = [
    { label: 'Débito', value: 'DEBIT' as TransactionType },
    { label: 'Crédito', value: 'CREDIT' as TransactionType }
  ];
  
  constructor(
    private transactionTypeService: TransactionTypeService,
    private accountService: AccountService,
    private messageService: MessageService,
    private router: Router
  ) {
    console.log('TransactionTypesComponent constructor called');
  }
  
  ngOnInit() {
    this.accountSubscription = this.accountService.getActiveAccount().subscribe(account => {
      this.activeAccount = account;
      if (account) {
        this.loadTransactionTypes();
      }
    });
  }
  
  loadTransactionTypes() {
    if (!this.activeAccount) {
      return;
    }

    this.loading = true;
    // Usando o novo endpoint que filtra por userId e accountId
    this.transactionTypeService.getByUserIdAndAccountId(this.activeAccount.userId || 1, this.activeAccount.id).subscribe({
      next: (data) => {
        this.transactionTypes = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erro', 
          detail: 'Erro ao carregar tipos de transação' 
        });
        this.loading = false;
        console.error('Error loading transaction types:', error);
      }
    });

    this.getAvailableAmount();
  }
  
  getAvailableAmount() {
    if (!this.activeAccount) {
      return;
    }
    
    this.transactionTypeService.getAvailableAmount(this.activeAccount.userId || 1, this.activeAccount.id).subscribe({
      next: (data) => {
        this.availableAmount = data;
        console.log('Available amount:', data);
      },
      error: (error) => {
        console.error('Error loading available amount:', error);
      }
    });
  }
  
  addNewTransactionType() {
    this.router.navigate(['/transaction-types/new']);
  }
  
  editTransactionType(transactionType: TransactionTypeModel) {
    this.router.navigate(['/transaction-types', transactionType.id, 'edit']);
  }
  
  delete(transactionType: TransactionTypeModel) {
    console.log('Delete method called for transaction type:', transactionType.id);
    this.transactionTypeService.delete(transactionType.id!).subscribe({
      next: () => {
        console.log('Transaction type deleted successfully');
        this.loadTransactionTypes();
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Tipo de transação excluído com sucesso' });
      },
      error: (error) => {
        console.error('Error deleting transaction type:', error);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir tipo de transação' });
      }
    });
  }

  ngOnDestroy() {
    if (this.accountSubscription) {
      this.accountSubscription.unsubscribe();
    }
  }
}
