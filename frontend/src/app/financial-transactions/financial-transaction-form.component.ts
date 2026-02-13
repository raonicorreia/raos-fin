import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { FinancialTransaction, TransactionStatus } from '../models/financial-transaction.model';
import { FinancialTransactionService } from '../services/financial-transaction.service';
import { AccountService } from '../services/account.service';
import { TransactionTypeService } from '../services/transaction-type.service';
import { TransactionTypeModel } from '../models/transaction-type.model';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { AvailableAmountService } from '../services/avaiable-amount.service';

@Component({
  selector: 'app-financial-transaction-form',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule],
  templateUrl: './financial-transaction-form.component.html',
  styleUrls: ['./financial-transaction-form.component.css']
})
export class FinancialTransactionFormComponent implements OnInit, OnDestroy, AfterViewInit {
  
  transaction: FinancialTransaction = { 
    userId: 1, 
    accountId: 1, 
    transactionTypeId: 1, 
    transactionTypeName: '', 
    status: 'PENDING' as TransactionStatus, 
    dueDate: new Date().toISOString().split('T')[0], 
    value: 0 
  };
  
  isEditMode: boolean = false;
  loading: boolean = false;
  activeAccount: any = null;
  private routeSub: Subscription | null = null;
  private accountSub: Subscription | null = null;
  private availableAmountState = inject(AvailableAmountService);

  @ViewChild('focusInput') inputElement!: ElementRef;

  statusOptions = [
    { label: 'Pendente', value: 'PENDING' as TransactionStatus },
    { label: 'Pago', value: 'PAID' as TransactionStatus }
  ];

  transactionTypes: TransactionTypeModel[] = [];
  loadingTransactionTypes: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private financialTransactionService: FinancialTransactionService,
    private accountService: AccountService,
    private transactionTypeService: TransactionTypeService,
    private messageService: MessageService
  ) {}
  
  ngAfterViewInit(): void {
    // this.inputElement.nativeElement.focus();
  }

  onTransactionTypeSelect(event: any): void {
    let transactionType = this.transactionTypes.find(tt => tt.id === event.value);
    this.transaction.value = transactionType?.value || 0;
  }

  ngOnInit(): void {
    // Carregar tipos de transação
    this.loadTransactionTypes();

    // Carregar conta ativa
    this.accountSub = this.accountService.getActiveAccount().subscribe(account => {
      this.activeAccount = account;
      if (account) {
        this.transaction.userId = account.userId || 1;
        this.transaction.accountId = account.id || 1;
      }
    });

    // Verificar modo (edição ou criação)
    this.routeSub = this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      
      if (id) {
        // Modo edição
        this.isEditMode = true;
        this.loadTransaction(parseInt(id));
      } else {
        // Modo criação
        this.isEditMode = false;
        this.resetForm();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    if (this.accountSub) {
      this.accountSub.unsubscribe();
    }
  }

  private loadTransaction(id: number): void {
    this.loading = true;
    this.financialTransactionService.getById(id).subscribe({
      next: (transaction) => {
        this.transaction = { ...transaction };
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar movimentação financeira'
        });
        this.loading = false;
        console.error('Error loading transaction:', error);
        this.router.navigate(['/financial-transactions']);
      }
    });
  }

  private resetForm(): void {
    this.transaction = { 
      userId: this.activeAccount?.userId || 1, 
      accountId: this.activeAccount?.id || 1, 
      transactionTypeId: 1, 
      transactionTypeName: '', 
      status: 'PENDING' as TransactionStatus, 
      dueDate: new Date().toISOString().split('T')[0], 
      value: 0 
    };
  }

  save(): void {
    if (!this.transaction.value || this.transaction.value <= 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Valor é obrigatório e deve ser maior que zero'
      });
      return;
    }

    if (!this.transaction.dueDate) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Data de vencimento é obrigatória'
      });
      return;
    }

    if (this.transaction.value > 99999999.99) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Valor máximo permitido é 99.999.999,99'
      });
      return;
    }

    this.loading = true;

    if (this.isEditMode) {
      // Atualizar transação existente
      const transactionId = this.transaction.id!;
      this.financialTransactionService.update(transactionId, this.transaction).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Movimentação atualizada com sucesso'
          });
          this.loading = false;
          this.router.navigate(['/financial-transactions']);
          this.availableAmountState.getAvailableAmount();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao atualizar movimentação'
          });
          this.loading = false;
          console.error('Error updating transaction:', error);
        }
      });
    } else {
      // Criar nova transação
      this.financialTransactionService.create(this.transaction).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Movimentação criada com sucesso'
          });
          this.loading = false;
          this.router.navigate(['/financial-transactions']);
          this.availableAmountState.getAvailableAmount();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao criar movimentação'
          });
          this.loading = false;
          console.error('Error creating transaction:', error);
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/financial-transactions']);
  }

  get title(): string {
    return this.isEditMode ? 'Editar Movimentação' : 'Nova Movimentação';
  }

  get valueDisplay(): string {
    return this.transaction.value ? `R$ ${this.transaction.value.toFixed(2)}` : 'R$ 0,00';
  }

  private loadTransactionTypes(): void {
    this.loadingTransactionTypes = true;
    this.transactionTypeService.getByUserId(1).subscribe({
      next: (transactionTypes) => {
        this.transactionTypes = transactionTypes.filter(tt => tt.active);
        this.loadingTransactionTypes = false;
      },
      error: (error) => {
        console.error('Error loading transaction types:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar tipos de transação'
        });
        this.loadingTransactionTypes = false;
      }
    });
  }
}
