import { Injectable, signal } from '@angular/core';
import { AccountService } from './account.service';
import { Account } from '../models/account.model';

@Injectable({
    providedIn: 'root'
})
export class AvailableAmountService {

    private _valor = signal<number>(0);
    valor = this._valor.asReadonly();
    activeAccount: Account | null = null;

    constructor(
        private accountService: AccountService,
    ) { }

    getAvailableAmount() {
        this.accountService.getActiveAccount().subscribe(account => {
            if (!account) {
                return;
            }
            this.accountService.getAvailableAmount(account.id || 1, account.userId || 1).subscribe({
                next: (data) => {
                    this._valor.set(data);
                    console.log('Available amount:', data);
                },
                error: (error) => {
                    console.error('Error loading available amount:', error);
                }
            });
        });
    }
}
