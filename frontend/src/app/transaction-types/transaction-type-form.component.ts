import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { TransactionTypeModel, TransactionType } from '../models/transaction-type.model';
import { TransactionTypeService } from '../services/transaction-type.service';
import { AccountService } from '../services/account.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-transaction-type-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-type-form.component.html',
  styleUrls: ['./transaction-type-form.component.css']
})
export class TransactionTypeFormComponent implements OnInit, OnDestroy, AfterViewInit {
  
  transactionType: TransactionTypeModel = { 
    name: '', 
    value: 0, 
    type: 'DEBIT' as TransactionType, 
    installments: 1, 
    dueDate: 1, 
    monthlyMovement: false, 
    userId: 1, 
    accountId: 1,
    active: true 
  };
  
  isEditMode: boolean = false;
  loading: boolean = false;
  activeAccount: any = null;
  private routeSub: Subscription | null = null;
  private accountSub: Subscription | null = null;
  @ViewChild('focusInput') inputElement!: ElementRef;

  transactionTypeOptions = [
    { label: 'Débito', value: 'DEBIT' as TransactionType },
    { label: 'Crédito', value: 'CREDIT' as TransactionType }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transactionTypeService: TransactionTypeService,
    private accountService: AccountService,
    private messageService: MessageService
  ) {}

  ngAfterViewInit(): void {
    this.inputElement.nativeElement.focus();
  }

  ngOnInit(): void {
    // Carregar conta ativa
    this.accountSub = this.accountService.getActiveAccount().subscribe(account => {
      this.activeAccount = account;
      if (account) {
        this.transactionType.userId = account.userId || 1;
        this.transactionType.accountId = account.id || 1;
      }
    });

    // Verificar modo (edição ou criação)
    this.routeSub = this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      
      if (id) {
        // Modo edição
        this.isEditMode = true;
        this.loadTransactionType(parseInt(id));
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

  private loadTransactionType(id: number): void {
    this.loading = true;
    this.transactionTypeService.getById(id).subscribe({
      next: (transactionType) => {
        this.transactionType = { ...transactionType };
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar tipo de transação'
        });
        this.loading = false;
        console.error('Error loading transaction type:', error);
        this.router.navigate(['/transaction-types']);
      }
    });
  }

  private resetForm(): void {
    this.transactionType = { 
      name: '', 
      value: 0, 
      type: 'DEBIT' as TransactionType, 
      installments: 0, 
      dueDate: 1, 
      monthlyMovement: false, 
      userId: this.activeAccount?.userId || 1, 
      accountId: this.activeAccount?.id || 1,
      active: true 
    };
  }

  onMonthlyMovementChange(): void {
    console.log('monthlyMovement changed to:', this.transactionType.monthlyMovement);
  }

  save(): void {
    if (!this.transactionType.name || this.transactionType.name.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Nome do tipo de transação é obrigatório'
      });
      return;
    }

    if (this.transactionType.name.length > 100) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Nome deve ter no máximo 100 caracteres'
      });
      return;
    }

    if (!this.transactionType.value || this.transactionType.value <= 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Valor é obrigatório e deve ser maior que zero'
      });
      return;
    }

    if (this.transactionType.value > 99999999.99) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Valor máximo permitido é 99.999.999,99'
      });
      return;
    }

    if (!this.transactionType.monthlyMovement && (this.transactionType.installments < 1 || this.transactionType.installments > 999)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Número de parcelas deve estar entre 1 e 999'
      });
      return;
    }

    if (this.transactionType.dueDate < 1 || this.transactionType.dueDate > 31) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Dia de vencimento deve estar entre 1 e 31'
      });
      return;
    }

    this.loading = true;

    if (this.isEditMode) {
      // Atualizar tipo de transação existente
      const transactionTypeId = this.transactionType.id!;
      this.transactionTypeService.update(transactionTypeId, this.transactionType).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Tipo de transação atualizado com sucesso'
          });
          this.loading = false;
          this.router.navigate(['/transaction-types']);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao atualizar tipo de transação'
          });
          this.loading = false;
          console.error('Error updating transaction type:', error);
        }
      });
    } else {
      // Criar novo tipo de transação
      this.transactionTypeService.create(this.transactionType).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Tipo de transação criado com sucesso'
          });
          this.loading = false;
          this.router.navigate(['/transaction-types']);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao criar tipo de transação'
          });
          this.loading = false;
          console.error('Error creating transaction type:', error);
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/transaction-types']);
  }

  get title(): string {
    return this.isEditMode ? 'Editar Tipo de Transação' : 'Novo Tipo de Transação';
  }

  get nameCharacterCount(): number {
    return this.transactionType.name?.length || 0;
  }

  get valueDisplay(): string {
    return this.transactionType.value ? `R$ ${this.transactionType.value.toFixed(2)}` : 'R$ 0,00';
  }
}
