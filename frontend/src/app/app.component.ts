import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { AccountService } from './services/account.service';
import { Account } from './models/account.model';
import { MenuComponent } from './components/menu/menu.component';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, MenubarModule, ButtonModule, AvatarModule, TieredMenuModule, MenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  private accountSubscription: Subscription | null = null;
  private authSubscription: Subscription | null = null;
  activeAccount: Account | null = null;
  currentUser: any = null;
  accountMenuItems: MenuItem[] = [];
  showAccountMenu: boolean = false;

  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.updateAccountMenu();
    this.accountSubscription = this.accountService.getActiveAccount().subscribe(account => {
      this.activeAccount = account;
    });

    this.authSubscription = this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    if (this.accountSubscription) {
      this.accountSubscription.unsubscribe();
    }
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  updateAccountMenu(): void {
    this.accountMenuItems = [
      {
        label: 'Trocar Conta',
        icon: 'pi pi-refresh',
        command: () => {
          this.accountService.clearActiveAccount();
          this.router.navigate(['/select-account']);
        }
      },
      {
        separator: true
      },
      {
        label: 'Sair',
        icon: 'pi pi-sign-out',
        command: () => {
          this.logout();
        }
      }
    ];
  }

  
  logout(): void {
    this.authService.logout();
    this.accountService.clearActiveAccount();
    window.location.href = '/login';
  }

  toggleAccountMenu(event: Event): void {
    this.showAccountMenu = !this.showAccountMenu;
  }

  executeCommand(item: MenuItem): void {
    if (item.command) {
      // Criar um evento compatível com MenuItemCommandEvent
      const event = {
        item: item,
        originalEvent: new Event('click')
      };
      item.command(event);
    }
  }

}
