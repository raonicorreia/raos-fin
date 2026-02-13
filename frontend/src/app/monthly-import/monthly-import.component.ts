import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { AccountService } from '../services/account.service';
import { MonthlyImportService, MonthlyImportRequest } from '../services/monthly-import.service';
import { User } from '../models/user.model';
import { Subscription } from 'rxjs';
import { AvailableAmountService } from '../services/avaiable-amount.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-monthly-import',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, ButtonModule, DropdownModule, InputNumberModule],
  templateUrl: './monthly-import.component.html',
  styleUrl: './monthly-import.component.css'
})
export class MonthlyImportComponent implements OnInit, OnDestroy {
  
  users: User[] = [];
  selectedMonth: number | null = null;
  selectedYear: number = new Date().getFullYear();
  loading: boolean = false;
  activeAccount: any = null;
  private accountSubscription: Subscription | null = null;
  
  constructor(
    private userService: UserService,
    private accountService: AccountService,
    private monthlyImportService: MonthlyImportService,
    private messageService: MessageService,
    private availableAmountState: AvailableAmountService,
    private router: Router,
  ) {
    this.loadUsers();
  }

  ngOnInit() {
    this.accountSubscription = this.accountService.getActiveAccount().subscribe(account => {
      this.activeAccount = account;
    });
  }
  
  loadUsers() {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erro', 
          detail: 'Erro ao carregar usuários' 
        });
        console.error('Error loading users:', error);
      }
    });
  }
  
  months = [
      { label: 'Janeiro', value: 1 },
      { label: 'Fevereiro', value: 2 },
      { label: 'Março', value: 3 },
      { label: 'Abril', value: 4 },
      { label: 'Maio', value: 5 },
      { label: 'Junho', value: 6 },
      { label: 'Julho', value: 7 },
      { label: 'Agosto', value: 8 },
      { label: 'Setembro', value: 9 },
      { label: 'Outubro', value: 10 },
      { label: 'Novembro', value: 11 },
      { label: 'Dezembro', value: 12 }
    ];
  
  importMonthlyMovements() {
    if (!this.selectedMonth) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Selecione um mês' });
      return;
    }
    
    this.loading = true;
    
    const request: MonthlyImportRequest = {
      userId: this.activeAccount.userId,
      accountId: this.activeAccount.id,
      month: this.selectedMonth,
      year: this.selectedYear
    };
    
    this.monthlyImportService.importMonthlyMovements(request).subscribe({
      next: (transactions) => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Sucesso', 
          detail: `${transactions.length} movimentações importadas para ${this.months.find(m => m.value === this.selectedMonth)?.label}/${this.selectedYear}` 
        });
        this.loading = false;
        this.availableAmountState.getAvailableAmount();
        this.router.navigate(['/financial-transactions']);
      },
      error: (error) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erro', 
          detail: 'Erro ao importar movimentações' 
        });
        this.loading = false;
        console.error('Error importing monthly movements:', error);
      }
    });
  }

  ngOnDestroy() {
    if (this.accountSubscription) {
      this.accountSubscription.unsubscribe();
    }
  }
}
