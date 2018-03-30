import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Account } from '../../app.store.model';

import { AccountService } from '../../services/account.service';

import { Message } from 'primeng/components/common/api';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/timer';

@Component({
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  account$: Observable<Account>;
  END_subscription$: Subject<boolean>;

  account: Account;
  email: string;
  password: string;

  loading: Boolean;

  messages: Message[];

  constructor(
    private accountService: AccountService,
    private router: Router
  ) {
    const me = this;
    me.END_subscription$ = new Subject<boolean>();
    me.account$ = me.accountService.account$.takeUntil(me.END_subscription$);

    me.email = '';
    me.password = '';
    me.loading = false;

    me.messages = [];
  }

  ngOnInit() {
    const me = this;
    me.account$.subscribe(
      data => {
        if (data && data['account']) {
          if (data['status'] === 'success') {
            if (data['account']['token']) {
              window.sessionStorage.setItem('userSession', data['account']['token']);
              me.loading = false;
              me.router.navigate(['sacraments','home']);
            } else if(data['account']['msg']) {
              me.loading = false;
              me.showMessage('error', 'Error', data['account']['msg']);
            }
          }
        }
      }
    );
  }

  ngOnDestroy() {
    const me = this;
    me.END_subscription$.next(true);
    me.END_subscription$.unsubscribe();
  }

  loginWithHash() {
    const me = this;
    if (me.email !== null && me.password !== null) {
      me.loading = true;
      me.accountService.logIn({
        'email': me.email,
        'password': me.password,
        'get_hash': true
      });
    }
  }

  showMessage(severity, summary, detail) {
    const me = this;
    me.messages = [];
    me.messages.push({severity: severity, summary: summary, detail: detail});
  }
}
