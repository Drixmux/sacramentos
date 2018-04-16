import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import { Account, User, Faithful, Header, Certificate, Work } from '../../../../app.store.model';
import { Observable } from 'rxjs/Observable';

import { UserService } from '../../../../services/user.service';
import { AccountService } from '../../../../services/account.service';
import { FaithfulService } from '../../../../services/faithful.service';
import { CertificateService } from '../../../../services/certificate.service';
import { WorkService } from '../../../../services/work.service';

import { Message } from 'primeng/components/common/api';

import { LOAD_ALL_FAITHFUL } from '../../../../reducers/faithful.reducer';

import { ValidateUtil } from '../../../../utils/validate.service';

import { MenuItem, SelectItem } from 'primeng/api';
import { CREATE_CERTIFICATE, LOAD_ALL_CERTIFICATES } from '../../../../reducers/certificate.reducer';

// import {Observable} from "rxjs";

@Component({
  templateUrl: './baptismCreate.component.html'
})
export class BaptismCreateComponent implements OnInit, OnDestroy {
  user$: Observable<User>;
  faithful$: Observable<Faithful[]>;
  certificate$: Observable<Certificate[]>;
  work$: Observable<Work[]>;
  END_subscription$: Subject<boolean>;

  account: Account;
  headers: Header[];
  allFaithful: Faithful[]; // TODO remove
  currCertificate: Certificate;
  calendarEs: any;
  certificates: Certificate[];
  works: Work[];

  faithful: Faithful;
  faithfulData: Faithful[];

  faithfulFather: Faithful;
  faithfulFatherData: Faithful[];
  faithfulMother: Faithful;
  faithfulMotherData: Faithful[];

  breadcrumbHome: MenuItem;
  breadcrumbItems: MenuItem[];

  loading: Boolean;

  messages: Message[];

  constructor(
    private router: Router,
    private userService: UserService,
    private accountService: AccountService,
    private faithfulService: FaithfulService,
    private certificateService: CertificateService,
    private workService: WorkService
  ) {
    const me = this;
    const today = new Date();

    me.END_subscription$ = new Subject<boolean>();
    me.user$ = me.userService.user$.takeUntil(me.END_subscription$);
    me.faithful$ = me.faithfulService.faithful$.takeUntil(me.END_subscription$);
    me.certificate$ = me.certificateService.certificate$.takeUntil(me.END_subscription$);
    me.work$ = me.workService.work$.takeUntil(me.END_subscription$);

    me.breadcrumbHome = {icon: 'fa fa-home', routerLink: ['/sacraments', 'home']};
    me.breadcrumbItems = [
      {label:'Bautizos', routerLink: ['/sacraments', 'baptism']},
      {label:'Registro'}
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

    me.currCertificate = {
      id: null,
      parroquiaId: null,
      sacerdoteCertificadorId: null,
      sacerdoteCelebranteId: null,
      jurisdiccionId: null,
      fecha: '',
      observaciones: '',
      fechaCreacion: '',
      user: {
        id: null,
        ci: '',
        nombres: '',
        apellidoMaterno: '',
        apellidoPaterno: '',
        celular: '',
        facebook: '',
        fechaNacimiento: '',
        genero: '',
        procedencia: '',
        fechaCreacion: ''
      },
      sacrament: {
        id: null,
        sacramento: '',
        fechaCreacion: ''
      }
    };

    me.faithfulFatherData = []; // TODO change

    me.faithfulMotherData = []; // TODO change

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
          case LOAD_ALL_FAITHFUL:
            if (data['payload'] && data['payload']['status'] && data['payload']['status'] == 'success') {
              me.allFaithful = data['payload']['faithful'];
            }
            break;
        }
      }
    );
    me.certificate$.subscribe(
      data => {
        switch (data['type']) {
          case LOAD_ALL_CERTIFICATES:
            if (data['payload'] && data['payload']['status'] && data['payload']['status'] == 'success') {
              me.certificates = data['payload']['certificates'];
            }
            break;
          case CREATE_CERTIFICATE:
            if (data['payload'] && data['payload']['status'] && data['payload']['status'] == 'success') {
              me.loading = false;
              me.certificates = data['payload']['certificates'];
              me.router.navigate(['sacraments', 'baptism']);
            } else if(data['payload'] && data['payload']['status'] && data['payload']['status'] == 'error' && data['payload']['msg']) {
              me.showMessage('error', 'Error', data['payload']['msg']);
              me.loading = false;
            }
            break;
        }
      }
    );
    me.work$.subscribe(
      data => {
        if (data && data['status'] && data['status'] == 'success') {
          me.works = data['obras'];
        }
      }
    );
    me.faithfulService.getAllFaithful();
    me.workService.getAllWorks({'id_tipo_obra': 1});
  }

  ngOnDestroy() {
    const me = this;
    me.END_subscription$.next(true);
    me.END_subscription$.unsubscribe();
  }

  validateData(record: Certificate) {
    const me = this;
    /*
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
    */
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

/*
  setBirthdayDate(event) {
    const me = this;
    me.currFaithful.fechaNacimiento = me.getFormatedDate(event);
  }
  addFaithful() {
    const me = this;
    if (me.validateData(me.currCertificate)) {
      me.loading = true;

      let params = {
        'nombres': me.currFaithful.nombres,
        'apellidoPaterno': me.currFaithful.apellidoPaterno,
        'apellidoMaterno': me.currFaithful.apellidoMaterno,
        'fechaNacimiento': me.currFaithful.fechaNacimiento,
        'procedencia': me.currFaithful.procedencia,
        'genero': me.currFaithful.genero,
        'fechaCreacion': me.currFaithful.fechaCreacion,
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

      me.faithfulService.addFaithful(params);
    }
  }
*/
  goToFaithfulList() {
    const me = this;
    me.router.navigate(['sacraments', 'faithful']);
  }

  filterFatherData(event) {
    /*const me = this;
    me.faithfulFatherData = me.certificates.filter(
      data => {
        return data.nombreCompleto.toLowerCase().indexOf(event.query.toLowerCase()) != -1 && parseInt(me.account.sub, 10) != data.id;
      }
    );*/
  }

  filterFaithfulData(event) {
    const me = this;
    me.faithfulData = me.allFaithful.filter(
      data => {
        return data.nombreCompleto.toLowerCase().indexOf(event.query.toLowerCase()) != -1;
      }
    );
  }

  filterMotherData(event) {
    /*const me = this;
    me.faithfulMotherData = me.certificates.filter(
      data => {
        return data.nombreCompleto.toLowerCase().indexOf(event.query.toLowerCase()) != -1 && parseInt(me.account.sub, 10) != data.id;
      }
    );*/
  }

  showMessage(severity, summary, detail) {
    const me = this;
    me.messages = [];
    me.messages.push({severity: severity, summary: summary, detail: detail});
  }
}
