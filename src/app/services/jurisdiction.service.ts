import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import { Jurisdiction } from '../app.store.model';

import { RedirectService } from './redirect.service';
import { HttpService } from './http.service';
import { AppStore } from '../app.store';
import { LOAD_ALL_JURISDICTION } from '../reducers/jurisdiction.reducer';

import 'rxjs/add/operator/map';

@Injectable()
export class JurisdictionService extends HttpService {
  jurisdiction$: Observable<Jurisdiction[]>;
  constructor(private http: Http,
              private redirectService: RedirectService,
              private store: Store<AppStore>) {
    super(http, redirectService);
    const me = this;
    me.jurisdiction$ =  me.store.pipe(select('jurisdiction'));
  }

  getAllJurisdictions(qparams) {
    const me = this;
    qparams['key'] = me.siicServiceToken;
    return me.get(me.siicServiceURL + '/public_api/jurisdicciones', {}, qparams).map(payload => ({type: LOAD_ALL_JURISDICTION, payload: payload}))
      .subscribe(action => {
        if ( (action.payload as any).length !== 0 ) {
          me.store.dispatch(action);
        }
      });
  }
}
