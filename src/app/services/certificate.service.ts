import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import { Certificate } from '../app.store.model';

import { RedirectService } from './redirect.service';
import { HttpService } from './http.service';
import { AppStore } from '../app.store';
import { LOAD_ALL_CERTIFICATES, LOAD_CERTIFICATE, CREATE_CERTIFICATE, UPDATE_CERTIFICATE, DELETE_CERTIFICATE } from '../reducers/certificate.reducer';

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

  getAllCertificates(qparams) {
    const me = this;
    return me.get(me.serviceURL + '/certificates/getAllCertificates', {}, qparams).map(payload => ({type: LOAD_ALL_CERTIFICATES, payload: payload}))
      .subscribe(action => {
        if ( (action.payload as any).length !== 0 ) {
          me.store.dispatch(action);
        }
      });
  }

  getCertificate(id: number, qparams: Object) {
    const me = this;
    return me.get(me.serviceURL + '/certificates/getCertificate/' + id, {}, qparams).map(payload => ({type: LOAD_CERTIFICATE, payload: payload}))
      .subscribe(action => {
        if ( (action.payload as any).length !== 0 ) {
          me.store.dispatch(action);
        }
      });
  }

  addCertificate(params: Object) {
    const me = this;
    return me.post(me.serviceURL + '/certificates/createCertificate', params).map(payload => ({type: CREATE_CERTIFICATE , payload: payload}))
      .subscribe(action => {
        if ( (action.payload as any).length !== 0 ) {
          me.store.dispatch(action);
        }
      });
  }

  updateCertificate(id: number, params: Object) {
    const me = this;
    return me.put(me.serviceURL + '/certificates/updateCertificate/' + id, params).map(payload => ({type: UPDATE_CERTIFICATE, payload: payload}))
      .subscribe(action => {
        if ( (action.payload as any).length !== 0 ) {
          me.store.dispatch(action);
        }
      });
  }

  deleteCertificate(id: number, params: Object) {
    const me = this;
    return me.delete(me.serviceURL + '/certificates/deleteCertificate/' + id).map(payload => ({type: DELETE_CERTIFICATE, payload: payload}))
      .subscribe(action => {
        if ( (action.payload as any).length !== 0 ) {
          me.store.dispatch(action);
        }
      });
  }
}
