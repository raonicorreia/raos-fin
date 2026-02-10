import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  newUser: User = { name: '', email: '', password: '', active: true };
  displayDialog: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService
  ) {}

  login(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (token) => {
        this.router.navigate(['/select-account']);
      },
      error: () => {
        this.errorMessage = 'Email ou senha inválidos.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  clearError(): void {
    this.errorMessage = '';
  }

  save() {
    if (!this.newUser.name || !this.newUser.email) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Nome e email são obrigatórios' });
      return;
    }
    
    // Create
    console.log('Creating user:', this.newUser);
    this.authService.register(this.newUser).subscribe({
      next: () => {
        console.log('User created successfully');
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário criado com sucesso' });
        this.displayDialog = false;
      },
      error: (error) => {
        console.error('Error creating user:', error);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao criar usuário' });
      }
    });
  }

  cancel() {
    this.displayDialog = false;
  }

  showDialogToAdd() {
    console.log('showDialogToAdd called');
    this.newUser = { name: '', email: '', password: '', active: true };
    this.displayDialog = true;
  }

}
