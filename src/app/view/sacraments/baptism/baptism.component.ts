import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import {Account, User, Certificate, Header } from '../../../app.store.model';
import { Observable } from 'rxjs/Observable';

import { UserService } from '../../../services/user.service';
import { AccountService } from '../../../services/account.service';
import { CertificateService } from '../../../services/certificate.service';

// import {ToastsManager} from 'ng2-toastr/ng2-toastr';
// import {Observable} from "rxjs";

@Component({
  templateUrl: './baptism.component.html'
})
export class BaptismComponent implements OnInit, OnDestroy {
  user$: Observable<User>;
  certificates$: Observable<Certificate[]>;
  END_subscription$: Subject<boolean>;

  account: Account;
  certificates: Certificate[];
  headers: Header[];

  constructor(
    private userService: UserService,
    private accountService: AccountService,
    private certificateService: CertificateService
  ) {
    const me = this;
    me.END_subscription$ = new Subject<boolean>();
    me.user$ = me.userService.user$.takeUntil(me.END_subscription$);
    me.certificates$ = me.certificateService.certificate$.takeUntil(me.END_subscription$);

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
    me.certificates = [];

    me.headers = [{
      header: 'Nombres',
      field: 'user.nombres'
    }, {
      header: 'Apellido paterno',
      field: 'user.apellidoPaterno'
    }, {
      header: 'Apellido materno',
      field: 'user.apellidoMaterno'
    }, {
      header: 'Fecha de bautizo',
      field: 'fecha'
    }, {
      header: 'Género',
      field: 'user.genero'
    }];

    /*
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
        nombres: 'Persona 1',
        apellidoPaterno: '1',
        apellidoMaterno: '1',
        celular: '',
        facebook: '',
        fechaNacimiento: '1998-05-12',
        genero: 'Masculino',
        procedencia: '',
        fechaCreacion: '1998-05-12',
      },
      sacrament: {
        id: 1,
        sacramento: 'Bautizo',
        fechaCreacion: '1998-05-12',
      }
    }, {
      id: 2,
      parroquiaId: 1,
      sacerdoteCertificadorId: 1,
      sacerdoteCelebranteId: 1,
      jurisdiccionId: 1,
      fecha: '1992-05-12',
      observaciones: '',
      fechaCreacion: '1992-05-12',
      user: {
        id: 2,
        ci: '',
        nombres: 'Persona 2',
        apellidoPaterno: '2',
        apellidoMaterno: '2',
        celular: '',
        facebook: '',
        fechaNacimiento: '1992-05-12',
        genero: 'Masculino',
        procedencia: '',
        fechaCreacion: '1992-05-12'
      },
      sacrament: {
        id: 1,
        sacramento: 'Bautizo',
        fechaCreacion: '1992-05-12'
      }
    }, {
      id: 3,
      parroquiaId: 1,
      sacerdoteCertificadorId: 1,
      sacerdoteCelebranteId: 1,
      jurisdiccionId: 1,
      fecha: '1996-05-12',
      observaciones: '',
      fechaCreacion: '1996-05-12',
      user: {
        id: 3,
        ci: '',
        nombres: 'Persona 3',
        apellidoPaterno: '3',
        apellidoMaterno: '3',
        celular: '',
        facebook: '',
        fechaNacimiento: '1996-05-12',
        genero: 'Masculino',
        procedencia: '',
        fechaCreacion: '1996-05-12'
      },
      sacrament: {
        id: 1,
        sacramento: 'Bautizo',
        fechaCreacion: '1996-05-12'
      }
    }, {
      id: 4,
      parroquiaId: 1,
      sacerdoteCertificadorId: 1,
      sacerdoteCelebranteId: 1,
      jurisdiccionId: 1,
      fecha: '1987-05-12',
      observaciones: '',
      fechaCreacion: '1987-05-12',
      user: {
        id: 4,
        ci: '',
        nombres: 'Persona 4',
        apellidoPaterno: '4',
        apellidoMaterno: '4',
        celular: '',
        facebook: '',
        fechaNacimiento: '1987-05-12',
        genero: 'Masculino',
        procedencia: '',
        fechaCreacion: '1987-05-12'
      },
      sacrament: {
        id: 1,
        sacramento: 'Bautizo',
        fechaCreacion: '1987-05-12'
      }
    }];
    */
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
    me.certificates$.subscribe(
      data => {
        if (data) {
          console.log(data);
        }
      }
    );
    me.certificateService.getCertificates({
      sacramentId: 1
    });
  }

  ngOnDestroy() {
    const me = this;
    me.END_subscription$.next(true);
    me.END_subscription$.unsubscribe();
  }
}
