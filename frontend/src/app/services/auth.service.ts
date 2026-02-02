import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_KEY = 'currentUser';
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor() {
    this.loadCurrentUser();
  }

  login(email: string, password: string): Observable<User> {
    // Mock de login - substituir com chamada real à API
    return of({
      id: 1,
      name: 'Usuário Teste',
      email: email,
      password: '', // Não armazenar senha no cliente
      active: true
    }).pipe(
      delay(1000), // Simular delay de rede
      map(user => {
        sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  getCurrentUserSync(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  private loadCurrentUser(): void {
    const stored = sessionStorage.getItem(this.USER_KEY);
    if (stored) {
      try {
        const user = JSON.parse(stored) as User;
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        sessionStorage.removeItem(this.USER_KEY);
      }
    }
  }
}
