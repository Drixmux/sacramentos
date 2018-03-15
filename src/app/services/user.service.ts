import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import { User } from '../app.store.model';

import { RedirectService } from './redirect.service';
import { HttpService } from './http.service';
import { AppStore } from '../app.store';
import { LOAD_USER } from '../reducers/user.reducer';

import 'rxjs/add/operator/map';

@Injectable()
export class UserService extends HttpService {
  user$: Observable<User>;
  constructor(private http: Http,
              private redirectService: RedirectService,
              private store: Store<AppStore>) {
    super(http, redirectService);
    const me = this;
    // me.user$ =  me.store.select('user');
    me.user$ =  me.store.pipe(select('user'));
  }
  getUser() {
    const me = this;
    return me.get(me.serviceURL + '/users/getUserInfo').map(payload => ({type: LOAD_USER, payload: payload}))
      .subscribe(action => {
        if ( (action.payload as any).length !== 0 ) {
          me.store.dispatch(action);
        }
      });
  }
}
