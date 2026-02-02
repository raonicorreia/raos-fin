import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { TransactionTypeModel, TransactionType } from '../models/transaction-type.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionTypeService {
  private endpoint = 'transaction-types';

  constructor(private apiService: ApiService) {}

  getAll(): Observable<TransactionTypeModel[]> {
    return this.apiService.get<TransactionTypeModel>(this.endpoint);
  }

  getByUserId(userId: number): Observable<TransactionTypeModel[]> {
    return this.apiService.getByUserId<TransactionTypeModel>(this.endpoint, userId);
  }

  getMonthlyMovementsByUserId(userId: number): Observable<TransactionTypeModel[]> {
    return this.apiService.get<TransactionTypeModel>(`${this.endpoint}/user/${userId}/monthly`);
  }

  getById(id: number): Observable<TransactionTypeModel> {
    return this.apiService.getById<TransactionTypeModel>(this.endpoint, id);
  }

  create(transactionType: TransactionTypeModel): Observable<TransactionTypeModel> {
    return this.apiService.post<TransactionTypeModel>(this.endpoint, transactionType);
  }

  update(id: number, transactionType: TransactionTypeModel): Observable<TransactionTypeModel> {
    return this.apiService.put<TransactionTypeModel>(this.endpoint, id, transactionType);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete(this.endpoint, id);
  }
}
