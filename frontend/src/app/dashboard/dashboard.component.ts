import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  
  constructor(private router: Router) {}
  
  navigateToUsers() {
    this.router.navigate(['/users']);
  }
  
  navigateToAccounts() {
    this.router.navigate(['/accounts']);
  }
  
  navigateToTransactionTypes() {
    this.router.navigate(['/transaction-types']);
  }
  
  navigateToFinancialTransactions() {
    this.router.navigate(['/financial-transactions']);
  }
  
  navigateToMonthlyImport() {
    this.router.navigate(['/monthly-import']);
  }
}
