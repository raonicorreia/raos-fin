import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
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
    // Verificar modo (edição ou criação)
    this.routeSub = this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      
      if (id) {
        // Modo edição
        this.isEditMode = true;
        this.loadUser(parseInt(id));
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
        console.error('Error loading user:', error);
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

    if (this.user.email.length > 100) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Email deve ter no máximo 100 caracteres'
      });
      return;
    }

    // Validação básica de email
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
      // Senha obrigatória apenas para criação
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
      // Atualizar usuário existente
      const userId = this.user.id!;
      this.userService.update(userId, this.user).subscribe({
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
          console.error('Error updating user:', error);
        }
      });
    } else {
      // Criar novo usuário
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
          console.error('Error creating user:', error);
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

  get nameCharacterCount(): number {
    return this.user.name?.length || 0;
  }

  get emailCharacterCount(): number {
    return this.user.email?.length || 0;
  }

  get passwordCharacterCount(): number {
    return this.user.password?.length || 0;
  }
}
