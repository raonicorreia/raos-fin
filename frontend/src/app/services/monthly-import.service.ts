import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { FinancialTransaction } from '../models/financial-transaction.model';

export interface MonthlyImportRequest {
  userId: number;
  accountId?: number;
  month: number;
  year?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MonthlyImportService {
  private endpoint = 'monthly-import';

  constructor(private apiService: ApiService) {}

  importMonthlyMovements(request: MonthlyImportRequest): Observable<FinancialTransaction[]> {
    return this.apiService.post<FinancialTransaction[]>(this.endpoint, request);
  }
}
