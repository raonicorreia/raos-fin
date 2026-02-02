import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
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
  ) {
    console.log('UsersComponent constructor called');
    console.log('UserService injected:', !!this.userService);
    console.log('MessageService injected:', !!this.messageService);
  }
  
  ngOnInit() {
    this.loadUsers();
  }
  
  loadUsers() {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (data) => {
        console.log(data);
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
        console.error('Error loading users:', error);
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
    console.log('Delete method called for user:', user.id);
    this.userService.delete(user.id!).subscribe({
      next: () => {
        console.log('User deleted successfully');
        this.loadUsers();
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário excluído com sucesso' });
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir usuário' });
      }
    });
  }
}
