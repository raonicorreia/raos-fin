import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  public getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  // Generic GET
  get<T>(endpoint: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.baseUrl}/${endpoint}`, {
      headers: this.getHeaders()
    });
  }

  getOne<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, {
      headers: this.getHeaders()
    });
  }

  // Generic GET by ID
  getById<T>(endpoint: string, id: number): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Generic POST
  post<T>(endpoint: string, data: any): Observable<T> {
    console.log(`ApiService POST to ${this.baseUrl}/${endpoint}:`, data);
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data, {
      headers: this.getHeaders()
    });
  }

  // Generic PUT
  put<T>(endpoint: string, id: number, data: any): Observable<T> {
    console.log(`ApiService PUT to ${this.baseUrl}/${endpoint}/${id}:`, data);
    return this.http.put<T>(`${this.baseUrl}/${endpoint}/${id}`, data, {
      headers: this.getHeaders()
    });
  }

  // Generic DELETE
  delete(endpoint: string, id: number): Observable<void> {
    console.log(`ApiService DELETE to ${this.baseUrl}/${endpoint}/${id}`);
    return this.http.delete<void>(`${this.baseUrl}/${endpoint}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Custom endpoints
  getByUserId<T>(endpoint: string, userId: number): Observable<T[]> {
    return this.http.get<T[]>(`${this.baseUrl}/${endpoint}/user/${userId}`, {
      headers: this.getHeaders()
    });
  }
}
