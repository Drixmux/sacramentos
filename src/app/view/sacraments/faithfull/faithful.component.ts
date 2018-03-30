import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Account, User, Faithful, Header } from '../../../app.store.model';
import { Observable } from 'rxjs/Observable';

import { UserService } from '../../../services/user.service';
import { AccountService } from '../../../services/account.service';
import { FaithfulService } from '../../../services/faithful.service';

import { AccountToolsService } from '../../../utils/account.tools.service';

import { ConfirmationService } from 'primeng/api';

import { Message } from 'primeng/components/common/api';

import {LOAD_ALL_FAITHFUL, CREATE_FAITHFUL, DELETE_FAITHFUL} from '../../../reducers/faithful.reducer';

import { Permissions } from '../../../constants';

import { MenuItem } from 'primeng/api';

// import {Observable} from "rxjs";

@Component({
  templateUrl: './faithful.component.html'
})
export class FaithfulComponent implements OnInit, OnDestroy {
  user$: Observable<User>;
  faithful$: Observable<Faithful[]>;
  END_subscription$: Subject<boolean>;

  account: Account;
  headers: Header[];
  faithful: Faithful[];

  breadcrumbHome: MenuItem;
  breadcrumbItems: MenuItem[];

  loading: boolean;
  quantity: number;

  canCreateFaithful: Boolean;
  canUpdateFaithful: Boolean;
  canDeleteFaithful: Boolean;
  canSeePdfFaithful: Boolean;

  permissions;

  messages: Message[];

  constructor(
    private accountToolsService: AccountToolsService,
    private userService: UserService,
    private accountService: AccountService,
    private faithfulService: FaithfulService,
    private confirmationService: ConfirmationService
  ) {
    const me = this;
    me.END_subscription$ = new Subject<boolean>();
    me.user$ = me.userService.user$.takeUntil(me.END_subscription$);
    me.faithful$ = me.faithfulService.faithful$.takeUntil(me.END_subscription$);

    me.permissions = Permissions;

    me.breadcrumbHome = {icon: 'fa fa-home', routerLink: ['/sacraments', 'home']};
    me.breadcrumbItems = [
      {label:'Fieles'}
    ];

    me.canCreateFaithful = false;
    me.canUpdateFaithful = false;
    me.canDeleteFaithful = false;
    me.canSeePdfFaithful = false;

    me.loading = true;
    me.quantity = 5;

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
    me.faithful = [];

    me.headers = [{
      header: 'Nombres',
      field: 'nombres'
    }, {
      header: 'Apellido paterno',
      field: 'apellidoPaterno'
    }, {
      header: 'Apellido materno',
      field: 'apellidoMaterno'
    }, {
      header: 'Fecha de nacimiento',
      field: 'fechaNacimiento'
    }, {
      header: 'Género',
      field: 'genero'
    }];

    me.messages = [];
  }

  ngOnInit() {
    const me = this;
    me.user$.subscribe(
      data => {
        if (data && data['account']) {
          me.account = data['account'];
          me.canCreateFaithful = me.accountToolsService.hasPermission(me.account, me.permissions.FIEL_CREAR);
          me.canUpdateFaithful = me.accountToolsService.hasPermission(me.account, me.permissions.FIEL_EDITAR);
          me.canDeleteFaithful = me.accountToolsService.hasPermission(me.account, me.permissions.FIEL_BORRAR);
          me.canSeePdfFaithful = me.accountToolsService.hasPermission(me.account, me.permissions.FIEL_PDF);
        }
      }, error => {
        me.accountService.logOut({});
      }
    );
    me.faithful$.subscribe(
      data => {
        switch (data['type']) {
          case LOAD_ALL_FAITHFUL:
          case CREATE_FAITHFUL:
            if (data['payload'] && data['payload']['status'] && data['payload']['status'] == 'success') {
              me.faithful = data['payload']['faithful'];
              me.loading = false;
            }
            break;
          case DELETE_FAITHFUL:
            if (data['payload'] && data['payload']['status'] && data['payload']['status'] == 'success') {
              me.faithful = data['payload']['faithful'];
              me.loading = false;
              me.showMessage('info', 'Eliminado', 'Se eliminó al fiel correctamente.');
            }
            break;
        }
      }
    );
    me.faithfulService.getAllFaithful();
  }

  ngOnDestroy() {
    const me = this;
    me.END_subscription$.next(true);
    me.END_subscription$.unsubscribe();
  }

  confirmDeleteModal(faithful) {
    const me = this;
    me.confirmationService.confirm({
      message: '¿Esta seguro que quiere eliminar al fiel?',
      header: 'Confirmación de eliminado',
      icon: 'fa fa-trash',
      accept: () => {
        me.loading = true;
        me.faithfulService.deleteFaithful({ 'id': faithful.id });
      }
    });
  }

  showMessage(severity, summary, detail) {
    const me = this;
    me.messages = [];
    me.messages.push({severity: severity, summary: summary, detail: detail});
  }
}
