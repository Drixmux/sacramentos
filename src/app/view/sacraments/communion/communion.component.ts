import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Account, User } from '../../../app.store.model';
import { Observable } from 'rxjs/Observable';

import { UserService } from '../../../services/user.service';
import { AccountService } from '../../../services/account.service';

// import {ToastsManager} from 'ng2-toastr/ng2-toastr';
// import {Observable} from "rxjs";

@Component({
  templateUrl: './communion.component.html'
})
export class CommunionComponent implements OnInit, OnDestroy {
  user$: Observable<User>;
  END_subscription$: Subject<boolean>;

  account: Account;

  constructor(
    private userService: UserService,
    private accountService: AccountService
  ) {
    const me = this;
    me.END_subscription$ = new Subject<boolean>();
    me.user$ = me.userService.user$.takeUntil(me.END_subscription$);

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
