export type TransactionStatus = 'PENDING' | 'PAID';

export interface FinancialTransaction {
  id?: number;
  userId: number;
  accountId: number;
  transactionTypeId: number;
  status: TransactionStatus;
  dueDate: string;
  paymentDate?: string;
  value: number;
}
