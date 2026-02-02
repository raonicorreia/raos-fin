import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { FinancialTransaction } from '../models/financial-transaction.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FinancialTransactionService {
  private endpoint = 'financial-transactions';

  constructor(private apiService: ApiService, private http: HttpClient) {}

  getAll(): Observable<FinancialTransaction[]> {
    return this.apiService.get<FinancialTransaction>(this.endpoint);
  }

  getByUserId(userId: number): Observable<FinancialTransaction[]> {
    return this.apiService.getByUserId<FinancialTransaction>(this.endpoint, userId);
  }

  getById(id: number): Observable<FinancialTransaction> {
    return this.apiService.getById<FinancialTransaction>(this.endpoint, id);
  }

  create(transaction: FinancialTransaction): Observable<FinancialTransaction> {
    return this.apiService.post<FinancialTransaction>(this.endpoint, transaction);
  }

  update(id: number, transaction: FinancialTransaction): Observable<FinancialTransaction> {
    return this.apiService.put<FinancialTransaction>(this.endpoint, id, transaction);
  }

  markAsPaid(id: number): Observable<FinancialTransaction> {
    return this.http.put<FinancialTransaction>(`${this.apiService.baseUrl}/${this.endpoint}/${id}/mark-as-paid`, {}, {
      headers: this.apiService.getHeaders()
    });
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete(this.endpoint, id);
  }
}
