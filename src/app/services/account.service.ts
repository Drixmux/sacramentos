import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import { Account } from '../app.store.model';

import { RedirectService } from './redirect.service';
import { HttpService } from './http.service';
import { AppStore } from '../app.store';
import { LOAD_ACCOUNT } from '../reducers/account.reducer';

import 'rxjs/add/operator/map';

@Injectable()
export class AccountService extends HttpService {
  account$: Observable<Account>;
  constructor(private http: Http,
              private redirectService: RedirectService,
              private store: Store<AppStore>) {
    super(http, redirectService);
    const me = this;
    // me.account$ =  me.store.select('account');
    me.account$ = me.store.pipe(select('account'));
  }
  logIn(params: Object) {
    const me = this;
    return me.post(me.serviceURL + '/signIn', params).map(payload => ({type: LOAD_ACCOUNT, payload: payload}))
      .subscribe(action => {
        if ( (action.payload as any).length !== 0 ) {
          me.store.dispatch(action);
        }
      });
  }
  logOut(params: Object) {
    const me = this;
    return me.post(me.serviceURL + '/signOut', params).map(payload => ({type: LOAD_ACCOUNT, payload: payload}))
      .subscribe(action => {
        if ( (action.payload as any).length !== 0 ) {
          me.store.dispatch(action);
        }
      });
  }
}
