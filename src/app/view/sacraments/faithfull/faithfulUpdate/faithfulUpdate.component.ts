import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import { Account, User, Faithful, Header } from '../../../../app.store.model';
import { Observable } from 'rxjs/Observable';

import { UserService } from '../../../../services/user.service';
import { AccountService } from '../../../../services/account.service';
import { FaithfulService } from '../../../../services/faithful.service';

import { Message } from 'primeng/components/common/api';

import { LOAD_FAITHFUL, UPDATE_FAITHFUL } from '../../../../reducers/faithful.reducer';

import { ValidateUtil } from '../../../../utils/validate.service';

import { MenuItem, SelectItem } from 'primeng/api';
import {toInt} from 'ngx-bootstrap/bs-moment/utils/type-checks';

// import {Observable} from "rxjs";

@Component({
  templateUrl: './faithfulUpdate.component.html'
})
export class FaithfulUpdateComponent implements OnInit, OnDestroy {
  user$: Observable<User>;
  faithful$: Observable<Faithful[]>;
  END_subscription$: Subject<boolean>;

  account: Account;
  headers: Header[];
  currFaithful: Faithful;
  currFaithfulBirthday: Date;
  calendarEs: any;
  faithful: Faithful[];
  faithfulFather: any;
  faithfulFatherData: any[];
  faithfulMother: any;
  faithfulMotherData: any[];
  genre: SelectItem[];

  breadcrumbHome: MenuItem;
  breadcrumbItems: MenuItem[];

  loading: Boolean;

  messages: Message[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private accountService: AccountService,
    private faithfulService: FaithfulService
  ) {
    const me = this;
    const today = new Date();

    me.END_subscription$ = new Subject<boolean>();
    me.user$ = me.userService.user$.takeUntil(me.END_subscription$);
    me.faithful$ = me.faithfulService.faithful$.takeUntil(me.END_subscription$);

    me.breadcrumbHome = {icon: 'fa fa-home', routerLink: ['/sacraments', 'home']};
    me.breadcrumbItems = [
      {label:'Fieles', routerLink: ['/sacraments', 'faithful']},
      {label:'Edición'}
    ];

    me.loading = false;

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

    me.currFaithful = {
      id: null,
      ci: '',
      nombres: '',
      apellidoMaterno: '',
      apellidoPaterno: '',
      nombreCompleto: '',
      celular: '',
      facebook: '',
      fechaNacimiento: '',
      genero: '',
      procedencia: '',
      fechaCreacion: me.getFormatedDate(today),
      birthCertificate: {
        id: null,
        orc: '',
        libro: '',
        partida: '',
        fechaCreacion: me.getFormatedDate(today)
      }
    };

    me.genre = [
      { label: 'Seleccione un género (*)', value: ''},
      { label: 'Masculino', value: 'masculino'},
      { label: 'Femenino', value: 'femenino'}
    ];

    me.faithfulFatherData = [];

    me.faithfulMotherData = [];

    me.calendarEs = {
      firstDayOfWeek: 1,
      dayNames: [ "Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado" ],
      dayNamesShort: [ "Dom","Lun","Mar","Mié","Jue","Vie","Sáb" ],
      dayNamesMin: [ "D","L","M","X","J","V","S" ],
      monthNames: [ "Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre" ],
      monthNamesShort: [ "Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic" ],
      today: 'Hoy',
      clear: 'Borrar'
    };

    me.messages = [];
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
    me.faithful$.subscribe(
      data => {
        switch (data['type']) {
          case LOAD_FAITHFUL:
            if (data['payload'] && data['payload']['status'] && data['payload']['status'] == 'success') {
              me.currFaithful = data['payload']['faithful'];
              me.currFaithfulBirthday = (me.currFaithful.fechaNacimiento != null) ? new Date(me.currFaithful.fechaNacimiento) : null;
            }
            break;
          case UPDATE_FAITHFUL:
            if (data['payload'] && data['payload']['status'] && data['payload']['status'] == 'success') {
              me.faithful = data['payload']['faithful'];
              me.router.navigate(['sacraments', 'faithful']);
            }
            break;
        }
      }
    );
    me.faithfulService.getFaithful(parseInt(me.route.snapshot.paramMap.get('faithfulId')), {});
  }

  ngOnDestroy() {
    const me = this;
    me.END_subscription$.next(true);
    me.END_subscription$.unsubscribe();
  }

  validateData(record: Faithful) {
    const me = this;

    if (!ValidateUtil.nonEmpty(me.currFaithful.nombres)) {
      me.showMessage('warn', 'Advertencia', 'El campo de nombres es obligatorio.');
      return false;
    }

    if (!ValidateUtil.nonEmpty(me.currFaithful.apellidoPaterno)) {
      me.showMessage('warn', 'Advertencia', 'El campo de apellido paterno es obligatorio.');
      return false;
    }

    if (!ValidateUtil.nonEmpty(me.currFaithful.apellidoMaterno)) {
      me.showMessage('warn', 'Advertencia', 'El campo de apellido materno es obligatorio.');
      return false;
    }

    if (!ValidateUtil.nonEmpty(me.currFaithful.fechaNacimiento)) {
      me.showMessage('warn', 'Advertencia', 'El campo de fecha de nacimiento es obligatorio.');
      return false;
    }

    if (!ValidateUtil.nonEmpty(me.currFaithful.procedencia)) {
      me.showMessage('warn', 'Advertencia', 'El campo de procedencia es obligatorio.');
      return false;
    }

    if (!ValidateUtil.nonEmpty(me.currFaithful.genero)) {
      me.showMessage('warn', 'Advertencia', 'El campo de género es obligatorio.');
      return false;
    }

    if (!ValidateUtil.nonEmpty(me.currFaithful.birthCertificate.orc)) {
      me.showMessage('warn', 'Advertencia', 'El campo de ORC es obligatorio.');
      return false;
    }

    if (!ValidateUtil.nonEmpty(me.currFaithful.birthCertificate.libro)) {
      me.showMessage('warn', 'Advertencia', 'El campo de libro es obligatorio.');
      return false;
    }

    if (!ValidateUtil.nonEmpty(me.currFaithful.birthCertificate.partida)) {
      me.showMessage('warn', 'Advertencia', 'El campo de partida es obligatorio.');
      return false;
    }

    return true;
  }

  getFormatedDate(currDate) {
    let dd;
    let mm;
    let yyyy = currDate.getFullYear();

    if(currDate.getDate() < 10) {
        dd = '0' + currDate.getDate();
    } else {
        dd = currDate.getDate();
    }

    if((currDate.getMonth() + 1) < 10) {
        mm = '0' + (currDate.getMonth() + 1);
    } else {
        mm = currDate.getMonth() + 1;
    }

    return yyyy + '-' + mm + '-' + dd;
  }

  setBirthdayDate(event) {
    const me = this;
    me.currFaithful.fechaNacimiento = me.getFormatedDate(event);
  }

  editFaithful() {
    const me = this;
    if (me.validateData(me.currFaithful)) {
      me.loading = true;

      let params = {
        'nombres': me.currFaithful.nombres,
        'apellidoPaterno': me.currFaithful.apellidoPaterno,
        'apellidoMaterno': me.currFaithful.apellidoMaterno,
        'fechaNacimiento': me.currFaithful.fechaNacimiento,
        'procedencia': me.currFaithful.procedencia,
        'genero': me.currFaithful.genero,
        'fechaCreacion': me.currFaithful.fechaCreacion,
        'birthCertificateId': me.currFaithful.birthCertificate.id,
        'orc': me.currFaithful.birthCertificate.orc,
        'libro': me.currFaithful.birthCertificate.libro,
        'partida': me.currFaithful.birthCertificate.partida
      };

      if (!!me.faithfulFather && !!me.faithfulFather.id) {
        params['padreId'] = me.faithfulFather.id;
      }
      if (!!me.faithfulMother && !!me.faithfulMother.id) {
        params['madreId'] = me.faithfulMother.id;
      }

      me.faithfulService.updateFaithful(me.currFaithful.id, params);
    }
  }

  goToFaithfulList() {
    const me = this;
    me.router.navigate(['sacraments', 'faithful']);
  }

  filterFatherData(event) {
    const me = this;
    me.faithfulFatherData = me.faithful.filter(
      data => {
        return data.nombreCompleto.toLowerCase().indexOf(event.query.toLowerCase()) != -1
          && me.currFaithful.id != data.id
          && data.genero == 'masculino';
      }
    );
  }

  filterMotherData(event) {
    const me = this;
    me.faithfulMotherData = me.faithful.filter(
      data => {
        return data.nombreCompleto.toLowerCase().indexOf(event.query.toLowerCase()) != -1
          && me.currFaithful.id != data.id
          && data.genero == 'femenino';
      }
    );
  }

  showMessage(severity, summary, detail) {
    const me = this;
    me.messages = [];
    me.messages.push({severity: severity, summary: summary, detail: detail});
  }
}
