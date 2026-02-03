export type TransactionStatus = 'PENDING' | 'PAID';

export interface FinancialTransaction {
  id?: number;
  userId: number;
  accountId: number;
  transactionTypeId: number;
  transactionTypeName: string;
  status: TransactionStatus;
  dueDate: string;
  paymentDate?: string;
  value: number;
}
