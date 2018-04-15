import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import { Faithful } from '../app.store.model';

import { RedirectService } from './redirect.service';
import { HttpService } from './http.service';
import { AppStore } from '../app.store';
import { LOAD_ALL_FAITHFUL, LOAD_FAITHFUL, CREATE_FAITHFUL, UPDATE_FAITHFUL, DELETE_FAITHFUL } from '../reducers/faithful.reducer';

import 'rxjs/add/operator/map';

@Injectable()
export class FaithfulService extends HttpService {
  faithful$: Observable<Faithful[]>;
  constructor(private http: Http,
              private redirectService: RedirectService,
              private store: Store<AppStore>) {
    super(http, redirectService);
    const me = this;
    me.faithful$ =  me.store.pipe(select('faithful'));
  }

  getAllFaithful() {
    const me = this;
    return me.get(me.serviceURL + '/faithful/getAllFaithful').map(payload => ({type: LOAD_ALL_FAITHFUL, payload: payload}))
      .subscribe(action => {
        if ( (action.payload as any).length !== 0 ) {
          me.store.dispatch(action);
        }
      });
  }

  getFaithful(id: number, qparams: Object) {
    const me = this;
    return me.get(me.serviceURL + '/faithful/getFaithful/' + id, {}, qparams).map(payload => ({type: LOAD_FAITHFUL, payload: payload}))
      .subscribe(action => {
        if ( (action.payload as any).length !== 0 ) {
          me.store.dispatch(action);
        }
      });
  }

  addFaithful(params: Object) {
    const me = this;
    return me.post(me.serviceURL + '/faithful/createFaithful', params).map(payload => ({type: CREATE_FAITHFUL, payload: payload}))
      .subscribe(action => {
        if ( (action.payload as any).length !== 0 ) {
          me.store.dispatch(action);
        }
      });
  }

  updateFaithful(id: number, params: Object) {
    const me = this;
    return me.put(me.serviceURL + '/faithful/updateFaithful/' + id, params).map(payload => ({type: UPDATE_FAITHFUL, payload: payload}))
      .subscribe(action => {
        if ( (action.payload as any).length !== 0 ) {
          me.store.dispatch(action);
        }
      });
  }

  deleteFaithful(id: number, params: Object) {
    const me = this;
    return me.delete(me.serviceURL + '/faithful/deleteFaithful/' + id).map(payload => ({type: DELETE_FAITHFUL, payload: payload}))
      .subscribe(action => {
        if ( (action.payload as any).length !== 0 ) {
          me.store.dispatch(action);
        }
      });
  }
}
