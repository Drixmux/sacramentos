import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import { Priest } from '../app.store.model';

import { RedirectService } from './redirect.service';
import { HttpService } from './http.service';
import { AppStore } from '../app.store';
import { LOAD_ALL_PRIESTS } from '../reducers/priest.reducer';

import 'rxjs/add/operator/map';

@Injectable()
export class PriestService extends HttpService {
  priest$: Observable<Priest[]>;
  constructor(private http: Http,
              private redirectService: RedirectService,
              private store: Store<AppStore>) {
    super(http, redirectService);
    const me = this;
    me.priest$ =  me.store.pipe(select('priest'));
  }

  getAllSacerdotes(qparams) {
    const me = this;
    qparams['key'] = me.siicServiceToken;
    return me.get(me.siicServiceURL + '/public_api/sacerdotes', {}, qparams).map(payload => ({type: LOAD_ALL_PRIESTS, payload: payload}))
      .subscribe(action => {
        if ( (action.payload as any).length !== 0 ) {
          me.store.dispatch(action);
        }
      });
  }
}
