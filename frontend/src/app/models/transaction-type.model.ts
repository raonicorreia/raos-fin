export type TransactionType = 'CREDIT' | 'DEBIT';

export interface TransactionTypeModel {
  id?: number;
  active: boolean;
  name: string;
  value: number;
  type: TransactionType;
  installments: number;
  dueDate: number;
  monthlyMovement: boolean;
  userId: number;
  accountId: number;
}
