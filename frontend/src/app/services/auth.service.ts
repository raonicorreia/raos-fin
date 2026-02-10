import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AuthResponse } from '../models/auth-response';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private endpoint = 'auth';
  private readonly USER_KEY = 'currentUser';
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);

  constructor(private apiService: ApiService) {
    this.loadCurrentUser();
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>(this.endpoint + "/login", {
      email: email,
      password: password
    }).pipe(
      map(auth => {
        sessionStorage.setItem(this.USER_KEY, JSON.stringify(auth));
        this.currentUserSubject.next(auth);
        return auth;
      })
    );
  }

  register(user: User): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>(this.endpoint + "/register", user);
  }

  logout(): void {
    sessionStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): Observable<AuthResponse | null> {
    return this.currentUserSubject.asObservable();
  }

  getCurrentUserSync(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  private loadCurrentUser(): void {
    const stored = sessionStorage.getItem(this.USER_KEY);
    if (stored) {
      try {
        const user = JSON.parse(stored) as AuthResponse;
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        sessionStorage.removeItem(this.USER_KEY);
      }
    }
  }
}
