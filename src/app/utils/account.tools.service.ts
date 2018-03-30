import { Injectable } from '@angular/core';
import { Account } from '../app.store.model';

@Injectable()
export class AccountToolsService {

  hasPermission(account: Account, permission:string): boolean {
    return account.permissions.includes(permission);
  }
}
