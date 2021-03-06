import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Account, User } from '../../../app.store.model';
import { Observable } from 'rxjs/Observable';

import { AccountService } from '../../../services/account.service';
import { UserService } from '../../../services/user.service';

import { MenuItem } from 'primeng/api';

// import {Observable} from "rxjs";

@Component({
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  account$: Observable<Account>;
  user$: Observable<User>;
  END_subscription$: Subject<boolean>;

  account: Account;

  breadcrumbHome: MenuItem;
  breadcrumbItems: MenuItem[];

  constructor(
    private accountService: AccountService,
    private userService: UserService
  ) {
    const me = this;
    me.END_subscription$ = new Subject<boolean>();
    me.account$ = me.accountService.account$.takeUntil(me.END_subscription$);
    me.user$ = me.userService.user$.takeUntil(me.END_subscription$);

    me.breadcrumbHome = {icon: 'fa fa-home', routerLink: ['/sacraments', 'home']};
    me.breadcrumbItems = [];

    me.account = {
      sub: '',
      email: '',
      exp: '',
      iat: '',
      role: '',
      permissions: [],
      fechaCreacion: null,
      user: null
    };
  }

  ngOnInit() {
    const me = this;
    me.user$.subscribe(
      data => {
        if (data && data['account']) {
          me.account = data['account'];
        }
      }, error => {
        me.accountService.logOut({});
      }
    );
  }

  ngOnDestroy() {
    const me = this;
    me.END_subscription$.next(true);
    me.END_subscription$.unsubscribe();
  }

}
