import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AccountService } from '../services/account.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private router: Router
  ) {
  }

  canActivate(): Observable<boolean> {
    
    // Primeiro verifica se o usuário está logado
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return new Observable(observer => observer.next(false));
    }

    // Verifica se há uma conta ativa usando o Observable
    return this.accountService.getActiveAccount().pipe(
      take(1),
      map(activeAccount => {
       
        if (activeAccount) {
          return true;
        } else {
          this.router.navigate(['/select-account']);
          return false;
        }
      })
    );
  }
}
