import { Injectable } from '@angular/core';
import { Http, Request, RequestOptionsArgs, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/throw';

import { RedirectService } from './redirect.service';

@Injectable()
export class HttpService {

  // public serviceURL = 'http://localhost/ceb-api/web';
  public serviceURL = 'http://api.pastoraldigital.net';
  public siicServiceURL = 'http://siic.pastoraldigital.net';

  public siicServiceToken = '$2y$04$vpEfQxLqYBtHEZhNsdDsxuc49FR2u7kmlhFJ4.MFnIVOE7KQniZT6';

  constructor(public _http: Http, private _redirectService: RedirectService) {}

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    const me = this;
    return me.intercept(me._http.request(url, me.getRequestOptionArgs(options)));
  }

  get(url: string, options?: RequestOptionsArgs, qparams?: Object): Observable<Response> {
    const me = this;
    return me.intercept(me._http.get(url, me.getRequestOptionArgs(options, qparams)));
  }

  post(url: string, body: Object, options?: RequestOptionsArgs): Observable<Response> {
    const me = this;
    return me.intercept(me._http.post(url, body, me.getRequestOptionArgs(options)));
  }

  put(url: string, body: Object, options?: RequestOptionsArgs): Observable<Response> {
    const me = this;
    return me.intercept(me._http.put(url, body, me.getRequestOptionArgs(options)));
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    const me = this;
    return me.intercept(me._http.delete(url, me.getRequestOptionArgs(options)));
  }

  getRequestOptionArgs(options?: RequestOptionsArgs, qparams?: Object): RequestOptionsArgs {
    if (!options) {
      options = new RequestOptions();
    }

    if (!options.headers) {
      options.headers = new Headers();
    }

    if (!!qparams) {
      options.params = qparams;
    }

    const userSession = window.sessionStorage.getItem('userSession');
    options.headers.append('Content-Type', 'application/json');
    if (userSession != null) {
      options.headers.append('Authorization', userSession);
    }
    return options;
  }

  intercept(observable: Observable<Response>): Observable<Response> {
    const me = this;
    return observable
      .map(me.extractData)
      .catch((response, source) => {
        if (response.status === 401) {
          me._redirectService.redirectToLogin();
          return Observable.empty();
        } else {
          return Observable.throw(response);
        }
      });
  }

  private extractData(response: Response): any {
    let body;
    if (!response['_body'] || response['_body'] === '') {
      response['_body'] = '{}';
    }
    body = response.json();
    return body.data || body || {};
  }
}
