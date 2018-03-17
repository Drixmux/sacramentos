import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import { Certificate } from '../app.store.model';

import { RedirectService } from './redirect.service';
import { HttpService } from './http.service';
import { AppStore } from '../app.store';
import { LOAD_CERTIFICATES } from '../reducers/certificate.reducer';

import 'rxjs/add/operator/map';

@Injectable()
export class CertificateService extends HttpService {
  certificate$: Observable<Certificate[]>;
  constructor(private http: Http,
              private redirectService: RedirectService,
              private store: Store<AppStore>) {
    super(http, redirectService);
    const me = this;
    me.certificate$ =  me.store.pipe(select('certificate'));
  }
  getCertificates(qparams) {
    const me = this;
    return me.get(me.serviceURL + '/certificates/getCertificatesBySacrament', {}, qparams).map(payload => ({type: LOAD_CERTIFICATES, payload: payload}))
      .subscribe(action => {
        if ( (action.payload as any).length !== 0 ) {
          me.store.dispatch(action);
        }
      });
  }
}
