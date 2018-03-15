import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { UserService } from '../services/user.service';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';

@Injectable()
export class MainResolver implements Resolve<any> {
  constructor(
    private userService: UserService
  ) { }

  resolve(): Observable<any> {
    const me = this;
    const userSession = window.sessionStorage.getItem('userSession');
    const location = window.location.href.split('#/')[1].split('/');

    if (userSession != null) {
      me.userService.getUser();
    }
    switch (location.length) {
      case 1:
        switch (location[0]) {
          case '':
            if (userSession == null) {
              return Observable.of('hi');
            }
            break;
          case 'login':
            return Observable.of({
              'msg': 'login'
            });
          case 'home':
            return Observable.of({
              'msg': 'home'
            });
          default:
            return Observable.of({
              'msg': 'end'
            });
        }
        break;
      default:
        return Observable.of({
          'msg': 'location +1'
        });
    }
  }
}
