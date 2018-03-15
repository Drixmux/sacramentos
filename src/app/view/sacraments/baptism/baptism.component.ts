import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import {Account, User, Certificate } from '../../../app.store.model';
import { Observable } from 'rxjs/Observable';

import { UserService } from '../../../services/user.service';
import { AccountService } from '../../../services/account.service';

// import {ToastsManager} from 'ng2-toastr/ng2-toastr';
// import {Observable} from "rxjs";

@Component({
  templateUrl: './baptism.component.html'
})
export class BaptismComponent implements OnInit, OnDestroy {
  user$: Observable<User>;
  END_subscription$: Subject<boolean>;

  account: Account;
  certificates: Certificate[];

  constructor(
    private userService: UserService,
    private accountService: AccountService
  ) {
    const me = this;
    me.END_subscription$ = new Subject<boolean>();
    me.user$ = me.userService.user$.takeUntil(me.END_subscription$);

    me.account = {
      sub: '',
      email: '',
      exp: '',
      iat: '',
      role: '',
      permissions: [],
      fechaCreacion: '',
      user: null
    };

    me.certificates = [{
      id: 1,
      parroquiaId: 1,
      sacerdoteCertificadorId: 1,
      sacerdoteCelebranteId: 1,
      jurisdiccionId: 1,
      fecha: '1998-05-12',
      observaciones: '',
      fechaCreacion: '1998-05-12',
      user: {
        id: 1,
        ci: '',
        nombres: 'Persona',
        apellidoPaterno: '1',
        apellidoMaterno: '1',
        celular: '',
        facebook: '',
        fechaNacimiento: '1998-05-12',
        genero: 'Masculino',
        procedencia: '',
        fechaCreacion: '1998-05-12'
      },
      sacrament: {
        id: 1,
        sacramento: 'Bautizo',
        fechaCreacion: '1998-05-12'
      }
    }, {
      id: 2,
      parroquiaId: 1,
      sacerdoteCertificadorId: 1,
      sacerdoteCelebranteId: 1,
      jurisdiccionId: 1,
      fecha: '1998-05-12',
      observaciones: '',
      fechaCreacion: '1998-05-12',
      user: {
        id: 2,
        ci: '',
        nombres: 'Persona',
        apellidoPaterno: '1',
        apellidoMaterno: '1',
        celular: '',
        facebook: '',
        fechaNacimiento: '1998-05-12',
        genero: 'Masculino',
        procedencia: '',
        fechaCreacion: '1998-05-12'
      },
      sacrament: {
        id: 1,
        sacramento: 'Bautizo',
        fechaCreacion: '1998-05-12'
      }
    }, {
      id: 3,
      parroquiaId: 1,
      sacerdoteCertificadorId: 1,
      sacerdoteCelebranteId: 1,
      jurisdiccionId: 1,
      fecha: '1998-05-12',
      observaciones: '',
      fechaCreacion: '1998-05-12',
      user: {
        id: 3,
        ci: '',
        nombres: 'Persona',
        apellidoPaterno: '1',
        apellidoMaterno: '1',
        celular: '',
        facebook: '',
        fechaNacimiento: '1998-05-12',
        genero: 'Masculino',
        procedencia: '',
        fechaCreacion: '1998-05-12'
      },
      sacrament: {
        id: 1,
        sacramento: 'Bautizo',
        fechaCreacion: '1998-05-12'
      }
    }, {
      id: 4,
      parroquiaId: 1,
      sacerdoteCertificadorId: 1,
      sacerdoteCelebranteId: 1,
      jurisdiccionId: 1,
      fecha: '1998-05-12',
      observaciones: '',
      fechaCreacion: '1998-05-12',
      user: {
        id: 4,
        ci: '',
        nombres: 'Persona',
        apellidoPaterno: '1',
        apellidoMaterno: '1',
        celular: '',
        facebook: '',
        fechaNacimiento: '1998-05-12',
        genero: 'Masculino',
        procedencia: '',
        fechaCreacion: '1998-05-12'
      },
      sacrament: {
        id: 1,
        sacramento: 'Bautizo',
        fechaCreacion: '1998-05-12'
      }
    }];
  }

  ngOnInit() {
    const me = this;
    me.user$.subscribe(
      data => {
        if (data && data['account']) {
          me.account = data['account'];
        }
      }, error => {
        me.accountService.logOut({});
      }
    );
  }

  ngOnDestroy() {
    const me = this;
    me.END_subscription$.next(true);
    me.END_subscription$.unsubscribe();
  }

}
