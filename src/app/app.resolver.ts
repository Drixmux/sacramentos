import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';

import { AccountService } from './services/account.service';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';

@Injectable()
export class AppResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private accountService: AccountService
  ) { }

  resolve() {
    const me = this;
    const userSession = window.sessionStorage.getItem('userSession');
    return Observable.of({
      'userLogged': false,
      'userSession': userSession
    });
  }
}
