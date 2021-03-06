import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import { Work } from '../app.store.model';

import { RedirectService } from './redirect.service';
import { HttpService } from './http.service';
import { AppStore } from '../app.store';
import { LOAD_ALL_WORKS } from '../reducers/work.reducer';

import 'rxjs/add/operator/map';

@Injectable()
export class WorkService extends HttpService {
  work$: Observable<Work[]>;
  constructor(private http: Http,
              private redirectService: RedirectService,
              private store: Store<AppStore>) {
    super(http, redirectService);
    const me = this;
    me.work$ =  me.store.pipe(select('work'));
  }

  getAllWorks(qparams) {
    const me = this;
    qparams['key'] = me.siicServiceToken;
    return me.get(me.siicServiceURL + '/public_api/obras', {}, qparams).map(payload => ({type: LOAD_ALL_WORKS, payload: payload}))
      .subscribe(action => {
        if ( (action.payload as any).length !== 0 ) {
          me.store.dispatch(action);
        }
      });
  }
}
