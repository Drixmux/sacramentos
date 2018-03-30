import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Account, User, Certificate, Header } from '../../../app.store.model';
import { Observable } from 'rxjs/Observable';

import { UserService } from '../../../services/user.service';
import { AccountService } from '../../../services/account.service';
import { CertificateService } from '../../../services/certificate.service';

// import {ToastsManager} from 'ng2-toastr/ng2-toastr';
// import {Observable} from "rxjs";

@Component({
  templateUrl: './marriage.component.html'
})
export class MarriageComponent implements OnInit, OnDestroy {
  user$: Observable<User>;
  certificates$: Observable<Certificate[]>;
  END_subscription$: Subject<boolean>;

  account: Account;
  certificates: Certificate[];
  headers: Header[];

  loading: boolean;
  quantity: number;

  constructor(
    private userService: UserService,
    private accountService: AccountService,
    private certificateService: CertificateService
  ) {
    const me = this;
    me.END_subscription$ = new Subject<boolean>();
    me.user$ = me.userService.user$.takeUntil(me.END_subscription$);
    me.certificates$ = me.certificateService.certificate$.takeUntil(me.END_subscription$);

    me.loading = true;
    me.quantity = 5;

    me.account = {
      sub: '',
      email: '',
      exp: '',
      iat: '',
      role: '',
      permissions: [],
      fechaCreacion: null,
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
      header: 'Fecha de matrimonio',
      field: 'fecha'
    }, {
      header: 'Género',
      field: 'user.genero'
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
    me.certificates$.subscribe(
      data => {
        if (data && data['status'] && data['status'] == 'success') {
          me.certificates = data['certificates'];
          me.loading = false;
        }
      }
    );
    me.certificateService.getCertificates({
      sacramentId: 4
    });
  }

  ngOnDestroy() {
    const me = this;
    me.END_subscription$.next(true);
    me.END_subscription$.unsubscribe();
  }

}