import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { Account } from '../models/account.model';
import { AccountService } from '../services/account.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-account-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.css']
})
export class AccountFormComponent implements OnInit, OnDestroy, AfterViewInit {
  
  account: Account = { name: '', balance: 0, userId: 1, active: true };
  isEditMode: boolean = false;
  loading: boolean = false;
  private routeSub: Subscription | null = null;
  @ViewChild('focusInput') inputElement!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      
      if (id) {
        // Modo edição
        this.isEditMode = true;
        this.loadAccount(parseInt(id));
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
  }

  ngAfterViewInit(): void {
    this.inputElement.nativeElement.focus();
  }

  private loadAccount(id: number): void {
    this.loading = true;
    this.accountService.getById(id).subscribe({
      next: (account) => {
        this.account = { ...account };
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar conta'
        });
        this.loading = false;
        console.error('Error loading account:', error);
        this.router.navigate(['/accounts']);
      }
    });
  }

  private resetForm(): void {
    this.account = { name: '', balance: 0, userId: 1, active: true };
  }

  save(): void {
    if (!this.account.name || this.account.name.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Nome da conta é obrigatório'
      });
      return;
    }

    if (this.account.name.length > 100) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Nome da conta deve ter no máximo 100 caracteres'
      });
      return;
    }

    this.loading = true;

    if (this.isEditMode) {
      // Atualizar conta existente
      const accountId = this.account.id!;
      this.accountService.update(accountId, this.account).subscribe({
        next: () => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Conta atualizada com sucesso'
          });
          this.navigateToReturnUrl();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao atualizar conta'
          });
          this.loading = false;
          console.error('Error updating account:', error);
        }
      });
    } else {
      // Criar nova conta
      this.accountService.create(this.account).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Conta criada com sucesso'
          });
          this.loading = false;
          this.navigateToReturnUrl();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao criar conta'
          });
          this.loading = false;
          console.error('Error creating account:', error);
        }
      });
    }
  }

  cancel(): void {
    this.navigateToReturnUrl();
  }

  private navigateToReturnUrl(): void {
    // Verifica se há uma URL de retorno armazenada (usada quando vem da seleção de conta)
    const returnUrl = sessionStorage.getItem('returnUrl');
    if (returnUrl) {
      sessionStorage.removeItem('returnUrl'); // Limpa a URL de retorno
      
      // Se estiver retornando para a tela de seleção, sinaliza para recarregar as contas
      if (returnUrl === '/select-account') {
        sessionStorage.setItem('returningFromAccountCreation', 'true');
      }
      
      this.router.navigate([returnUrl]);
    } else {
      this.router.navigate(['/accounts']); // Rota padrão
    }
  }

  get title(): string {
    return this.isEditMode ? 'Editar Conta' : 'Nova Conta';
  }

  get nameCharacterCount(): number {
    return this.account.name?.length || 0;
  }
}
