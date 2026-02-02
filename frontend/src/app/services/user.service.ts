import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private endpoint = 'users';

  constructor(private apiService: ApiService) {}

  getAll(): Observable<User[]> {
    return this.apiService.get<User>(this.endpoint);
  }

  getById(id: number): Observable<User> {
    return this.apiService.getById<User>(this.endpoint, id);
  }

  create(user: User): Observable<User> {
    console.log('UserService.create called with:', user);
    return this.apiService.post<User>(this.endpoint, user);
  }

  update(id: number, user: User): Observable<User> {
    console.log('UserService.update called with:', id, user);
    return this.apiService.put<User>(this.endpoint, id, user);
  }

  delete(id: number): Observable<void> {
    console.log('UserService.delete called with:', id);
    return this.apiService.delete(this.endpoint, id);
  }
}
