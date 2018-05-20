import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Account, User, Certificate, Header } from '../../../app.store.model';
import { Observable } from 'rxjs/Observable';

import { UserService } from '../../../services/user.service';
import { AccountService } from '../../../services/account.service';
import { CertificateService } from '../../../services/certificate.service';

import { AccountToolsService } from '../../../utils/account.tools.service';

import { MenuItem } from 'primeng/api';

import { Message } from 'primeng/components/common/api';

import { ConfirmationService } from 'primeng/api';

import { LOAD_ALL_CERTIFICATES } from '../../../reducers/certificate.reducer';

import { Permissions, Sacraments } from '../../../constants';

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

  breadcrumbHome: MenuItem;
  breadcrumbItems: MenuItem[];

  loading: boolean;
  quantity: number;

  canCreateMarriage: Boolean;
  canUpdateMarriage: Boolean;
  canDeleteMarriage: Boolean;
  canSeePdfMarriage: Boolean;

  permissions;

  messages: Message[];

  constructor(
    private accountToolsService: AccountToolsService,
    private userService: UserService,
    private accountService: AccountService,
    private certificateService: CertificateService,
    private confirmationService: ConfirmationService
  ) {
    const me = this;
    me.END_subscription$ = new Subject<boolean>();
    me.user$ = me.userService.user$.takeUntil(me.END_subscription$);
    me.certificates$ = me.certificateService.certificate$.takeUntil(me.END_subscription$);

    me.loading = true;
    me.quantity = 5;

    me.permissions = Permissions;

    me.breadcrumbHome = {icon: 'fa fa-home', routerLink: ['/sacraments', 'home']};
    me.breadcrumbItems = [
      {label:'Matrimonio'}
    ];

    me.canCreateMarriage = false;
    me.canUpdateMarriage = false;
    me.canDeleteMarriage = false;
    me.canSeePdfMarriage = false;

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
          me.canCreateMarriage = me.accountToolsService.hasPermission(me.account, me.permissions.MATRIMONIO_CREAR);
          //me.canUpdateMarriage = me.accountToolsService.hasPermission(me.account, me.permissions.MATRIMONIO_EDITAR);
          //me.canDeleteMarriage = me.accountToolsService.hasPermission(me.account, me.permissions.MATRIMONIO_BORRAR);
          //me.canSeePdfMarriage = me.accountToolsService.hasPermission(me.account, me.permissions.MATRIMONIO_PDF);
        }
      }, error => {
        me.accountService.logOut({});
      }
    );
    me.certificates$.subscribe(
      data => {
        switch (data['type']) {
          case LOAD_ALL_CERTIFICATES:
            if (data['payload'] && data['payload']['status'] && data['payload']['status'] == 'success') {
              me.certificates = data['payload']['certificates'];
              me.loading = false;
            }
            break;
        }
      }
    );
    me.certificateService.getAllCertificates({
      sacramentId: Sacraments.MATRIMONIO
    });
  }

  ngOnDestroy() {
    const me = this;
    me.END_subscription$.next(true);
    me.END_subscription$.unsubscribe();
  }

  confirmDeleteModal(certificate) {
    const me = this;
    me.confirmationService.confirm({
      message: '¿Esta seguro que quiere eliminar el certificado de matrimonio de los fieles?',
      header: 'Confirmación de eliminado',
      icon: 'fa fa-trash',
      accept: () => {
        me.loading = true;
        me.certificateService.deleteCertificate(certificate.id, {});
      }
    });
  }

  showMessage(severity, summary, detail) {
    const me = this;
    me.messages = [];
    me.messages.push({severity: severity, summary: summary, detail: detail});
  }
}
