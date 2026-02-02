import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Account } from 'src/app/models/account.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterLink
  ],
  providers: [],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {

  currentUser: any = null;
  activeAccount: Account | null = null;
  private authSubscription: Subscription | null = null;
  private accountSubscription: Subscription | null = null;

  items = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: ['/dashboard']
    },
    {
      label: 'Contas',
      icon: 'pi pi-wallet',
      routerLink: ['/accounts']
    },
    {
      label: 'Tipos de Transação',
      icon: 'pi pi-list',
      routerLink: ['/transaction-types']
    },
    {
      label: 'Movimentações',
      icon: 'pi pi-money-bill',
      routerLink: ['/financial-transactions']
    },
    {
      label: 'Importação Mensal',
      icon: 'pi pi-upload',
      routerLink: ['/monthly-import']
    }
  ];

  constructor(
    private authService: AuthService,
  ) {
    console.log('MenuComponent constructor called');
  }

  updateMenuItems(): void {
    if (this.currentUser) {
      this.items = [
        {
          label: 'Dashboard',
          icon: 'pi pi-home',
          routerLink: ['/dashboard']
        },
        {
          label: 'Contas',
          icon: 'pi pi-wallet',
          routerLink: ['/accounts']
        },
        {
          label: 'Tipos de Transação',
          icon: 'pi pi-list',
          routerLink: ['/transaction-types']
        },
        {
          label: 'Movimentações',
          icon: 'pi pi-money-bill',
          routerLink: ['/financial-transactions']
        },
        {
          label: 'Importação Mensal',
          icon: 'pi pi-upload',
          routerLink: ['/monthly-import']
        }
      ];
    } else {
      this.items = [];
    }
  }

  ngOnInit(): void {
    this.updateMenuItems();

    this.authSubscription = this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      this.updateMenuItems();
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.accountSubscription) {
      this.accountSubscription.unsubscribe();
    }
  }

}