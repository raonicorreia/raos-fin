import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { Account } from '../models/account.model';
import { AvailableAmount } from '../models/available-amount.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private endpoint = 'accounts';
  private readonly ACTIVE_ACCOUNT_KEY = 'activeAccount';
  private activeAccountSubject = new BehaviorSubject<Account | null>(null);

  constructor(private apiService: ApiService) {
    this.loadActiveAccount();
  }

  getAll(): Observable<Account[]> {
    return this.apiService.get<Account>(this.endpoint);
  }

  getByUserId(userId: number): Observable<Account[]> {
    return this.apiService.getByUserId<Account>(this.endpoint, userId);
  }

  getById(id: number): Observable<Account> {
    return this.apiService.getById<Account>(this.endpoint, id);
  }

  getAvailableAmount(id: number, userId: number): Observable<AvailableAmount> {
    return this.apiService.getOne<AvailableAmount>(`${this.endpoint}/${id}/user/${userId}/available-amount`);
  }

  create(account: Account): Observable<Account> {
    return this.apiService.post<Account>(this.endpoint, account);
  }

  update(id: number, account: Account): Observable<Account> {
    return this.apiService.put<Account>(this.endpoint, id, account);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete(this.endpoint, id);
  }

  // Gerenciamento de conta ativa
  getActiveAccount(): Observable<Account | null> {
    return this.activeAccountSubject.asObservable();
  }

  getActiveAccountSync(): Account | null {
    return this.activeAccountSubject.value;
  }

  setActiveAccount(account: Account): void {
    sessionStorage.setItem(this.ACTIVE_ACCOUNT_KEY, JSON.stringify(account));
    this.activeAccountSubject.next(account);
  }

  clearActiveAccount(): void {
    sessionStorage.removeItem(this.ACTIVE_ACCOUNT_KEY);
    this.activeAccountSubject.next(null);
  }

  hasActiveAccount(): boolean {
    return this.activeAccountSubject.value !== null;
  }

  private loadActiveAccount(): void {
    const stored = sessionStorage.getItem(this.ACTIVE_ACCOUNT_KEY);
    if (stored) {
      try {
        const account = JSON.parse(stored) as Account;
        this.activeAccountSubject.next(account);
      } catch (error) {
        console.error('Erro ao carregar conta ativa:', error);
        sessionStorage.removeItem(this.ACTIVE_ACCOUNT_KEY);
      }
    }
  }
}
