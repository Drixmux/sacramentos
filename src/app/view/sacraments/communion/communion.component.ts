import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Account, User, Certificate, Header } from '../../../app.store.model';
import { Observable } from 'rxjs/Observable';

import { UserService } from '../../../services/user.service';
import { AccountService } from '../../../services/account.service';
import { CertificateService } from '../../../services/certificate.service';

import { AccountToolsService } from '../../../utils/account.tools.service';

import { Message } from 'primeng/components/common/api';

import { ConfirmationService } from 'primeng/api';

import { CREATE_CERTIFICATE, DELETE_CERTIFICATE, LOAD_ALL_CERTIFICATES, UPDATE_CERTIFICATE } from '../../../reducers/certificate.reducer';

import { Permissions, Sacraments } from '../../../constants';

import { MenuItem } from 'primeng/api';

// import {Observable} from "rxjs";

@Component({
  templateUrl: './communion.component.html'
})
export class CommunionComponent implements OnInit, OnDestroy {
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

  canCreateCommunion: Boolean;
  canUpdateCommunion: Boolean;
  canDeleteCommunion: Boolean;
  canSeePdfCommunion: Boolean;

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
      {label:'Primera comunión'}
    ];

    me.canCreateCommunion = false;
    me.canUpdateCommunion = false;
    me.canDeleteCommunion = false;
    me.canSeePdfCommunion = false;

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
      header: 'Fecha de comunión',
      field: 'fecha'
    }, {
      header: 'Género',
      field: 'user.genero'
    }];

    me.messages = [];
  }

  ngOnInit() {
    const me = this;
    me.user$.subscribe(
      data => {
        if (data && data['account']) {
          me.account = data['account'];
          me.canCreateCommunion = me.accountToolsService.hasPermission(me.account, me.permissions.COMUNION_CREAR);
          me.canUpdateCommunion = me.accountToolsService.hasPermission(me.account, me.permissions.COMUNION_EDITAR);
          me.canDeleteCommunion = me.accountToolsService.hasPermission(me.account, me.permissions.COMUNION_BORRAR);
          //me.canSeePdfCommunion = me.accountToolsService.hasPermission(me.account, me.permissions.COMUNION_PDF);
        }
      }, error => {
        me.accountService.logOut({});
      }
    );
    me.certificates$.subscribe(
      data => {
        switch (data['type']) {
          case LOAD_ALL_CERTIFICATES:
          case CREATE_CERTIFICATE:
          case UPDATE_CERTIFICATE:
            if (data['payload'] && data['payload']['status'] && data['payload']['status'] == 'success') {
              me.certificates = data['payload']['certificates'];
              me.loading = false;
            }
            break;
          case DELETE_CERTIFICATE:
            if (data['payload'] && data['payload']['status'] && data['payload']['status'] == 'success') {
              me.certificates = data['payload']['certificates'];
              me.loading = false;
              me.showMessage('info', 'Eliminado', 'Se eliminó el certificado del fiel correctamente.');
            }
            break;
        }
      }
    );
    me.certificateService.getAllCertificates({
      sacramentId: Sacraments.COMUNION
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
      message: '¿Esta seguro que quiere eliminar el certificado de primera comunión del fiel?',
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
