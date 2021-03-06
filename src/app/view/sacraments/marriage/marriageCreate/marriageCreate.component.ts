import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import { Account, User, Faithful, Header, Certificate, Work, Jurisdiction, Priest } from '../../../../app.store.model';
import { Observable } from 'rxjs/Observable';

import { UserService } from '../../../../services/user.service';
import { AccountService } from '../../../../services/account.service';
import { FaithfulService } from '../../../../services/faithful.service';
import { CertificateService } from '../../../../services/certificate.service';
import { WorkService } from '../../../../services/work.service';
import { JurisdictionService } from '../../../../services/jurisdiction.service';
import { PriestService } from '../../../../services/priest.service';

import { Message } from 'primeng/components/common/api';

import { LOAD_ALL_FAITHFUL } from '../../../../reducers/faithful.reducer';

import { ValidateUtil } from '../../../../utils/validate.service';

import { MenuItem, SelectItem } from 'primeng/api';
import { CREATE_CERTIFICATE, LOAD_ALL_CERTIFICATES } from '../../../../reducers/certificate.reducer';

import { Sacraments } from '../../../../constants';

// import {Observable} from "rxjs";

@Component({
  templateUrl: './marriageCreate.component.html'
})
export class MarriageCreateComponent implements OnInit, OnDestroy {
  user$: Observable<User>;
  faithful$: Observable<Faithful[]>;
  certificate$: Observable<Certificate[]>;
  work$: Observable<Work[]>;
  jurisdiction$: Observable<Jurisdiction[]>;
  priest$: Observable<Priest[]>;
  END_subscription$: Subject<boolean>;

  account: Account;
  headers: Header[];
  currCertificate: Certificate;
  calendarEs: any;
  allFaithful: Faithful[];
  certificates: Certificate[];
  works: Work[];
  jurisdictions: Jurisdiction[];
  priests: Priest[];

  faithful: Faithful;
  faithfulData: Faithful[];
  work: Work;
  workData: Work[];
  jurisdiction: Jurisdiction;
  jurisdictionData: Jurisdiction[];
  certifyingPriest: Priest;
  certifyingPriestData: Priest[];
  celebrantPriest: Priest;
  celebrantPriestData: Priest[];
  faithfulFather: Faithful;
  faithfulFatherData: Faithful[];
  faithfulMother: Faithful;
  faithfulMotherData: Faithful[];
  faithfulGodFather: Faithful;
  faithfulGodFatherData: Faithful[];
  faithfulGodMother: Faithful;
  faithfulGodMotherData: Faithful[];

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
    private workService: WorkService,
    private jurisdictionService: JurisdictionService,
    private priestService: PriestService
  ) {
    const me = this;
    const today = new Date();

    me.END_subscription$ = new Subject<boolean>();
    me.user$ = me.userService.user$.takeUntil(me.END_subscription$);
    me.faithful$ = me.faithfulService.faithful$.takeUntil(me.END_subscription$);
    me.certificate$ = me.certificateService.certificate$.takeUntil(me.END_subscription$);
    me.work$ = me.workService.work$.takeUntil(me.END_subscription$);
    me.jurisdiction$ = me.jurisdictionService.jurisdiction$.takeUntil(me.END_subscription$);
    me.priest$ = me.priestService.priest$.takeUntil(me.END_subscription$);

    me.breadcrumbHome = {icon: 'fa fa-home', routerLink: ['/sacraments', 'home']};
    me.breadcrumbItems = [
      {label:'Matrimonio', routerLink: ['/sacraments', 'marriage']},
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
      },
      libroParroquia: {
        id: null,
        parroquiaId: null,
        libro: '',
        pagina: '',
        numero: '',
        fechaCreacion: ''
      }
    };

    me.workData = [];
    me.jurisdictionData = [];
    me.celebrantPriestData = [];
    me.certifyingPriestData = [];
    me.faithfulFatherData = [];
    me.faithfulMotherData = [];
    me.faithfulGodFatherData = [];
    me.faithfulGodMotherData = [];

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
    me.jurisdiction$.subscribe(
      data => {
        if (data && data['status'] && data['status'] == 'success') {
          me.jurisdictions = data['jurisdicciones'];
        }
      }
    );
    me.priest$.subscribe(
      data => {
        if (data && data['status'] && data['status'] == 'success') {
          me.priests = data['sacerdotes'];
        }
      }
    );
    me.certificateService.getAllCertificates({'sacramentId': Sacraments.BAUTIZO});
    me.faithfulService.getAllFaithful();
    me.workService.getAllWorks({'id_tipo_obra': 1});
    me.jurisdictionService.getAllJurisdictions({});
    me.priestService.getAllSacerdotes({});
  }

  ngOnDestroy() {
    const me = this;
    me.END_subscription$.next(true);
    me.END_subscription$.unsubscribe();
  }

  validateData() {
    const me = this;
    if (!ValidateUtil.hasProperty(me.faithful, 'id')) {
      me.showMessage('warn', 'Advertencia', 'El campo de Feligrés es obligatorio.');
      return false;
    }

    if (!ValidateUtil.hasProperty(me.work, 'id')) {
      me.showMessage('warn', 'Advertencia', 'El campo de Parroquia es obligatorio.');
      return false;
    }

    if (!ValidateUtil.nonEmpty(me.currCertificate.fecha)) {
      me.showMessage('warn', 'Advertencia', 'El campo de Fecha de celebración es obligatorio.');
      return false;
    }

    if (!ValidateUtil.hasProperty(me.jurisdiction, 'id')) {
      me.showMessage('warn', 'Advertencia', 'El campo de Jurisdicción es obligatorio.');
      return false;
    }

    if (!ValidateUtil.hasProperty(me.celebrantPriest, 'id')) {
      me.showMessage('warn', 'Advertencia', 'El campo de Sacerdote celebrante es obligatorio.');
      return false;
    }

    if (!ValidateUtil.hasProperty(me.certifyingPriest, 'id')) {
      me.showMessage('warn', 'Advertencia', 'El campo de Sacerdote certificador es obligatorio.');
      return false;
    }

    if (!ValidateUtil.nonEmpty(me.currCertificate.libroParroquia.libro)) {
      me.showMessage('warn', 'Advertencia', 'El campo de Libro es obligatorio.');
      return false;
    }

    if (!ValidateUtil.nonEmpty(me.currCertificate.libroParroquia.pagina)) {
      me.showMessage('warn', 'Advertencia', 'El campo de Página es obligatorio.');
      return false;
    }

    if (!ValidateUtil.nonEmpty(me.currCertificate.libroParroquia.numero)) {
      me.showMessage('warn', 'Advertencia', 'El campo de Número es obligatorio.');
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

  setCertificateDate(event) {
    const me = this;
    me.currCertificate.fecha = me.getFormatedDate(event);
  }

  addBaptism() {
    const me = this;
    if (me.validateData()) {
      me.loading = true;

      let params = {
        'sacramentId': Sacraments.BAUTIZO,
        'faithfulId': me.faithful.id,
        'workId': me.work.id,
        'fecha': me.currCertificate.fecha,
        'jurisdictionId': me.jurisdiction.id,
        'celebrantPriestId': me.celebrantPriest.id,
        'certifyingPriestId': me.certifyingPriest.id,
        'libro': me.currCertificate.libroParroquia.libro,
        'pagina': me.currCertificate.libroParroquia.pagina,
        'numero': me.currCertificate.libroParroquia.numero,
        'observaciones': me.currCertificate.observaciones
      };

      if (!!me.faithfulFather && !!me.faithfulFather.id) {
        params['padreId'] = me.faithfulFather.id;
      }
      if (!!me.faithfulMother && !!me.faithfulMother.id) {
        params['madreId'] = me.faithfulMother.id;
      }
      if (!!me.faithfulGodFather && !!me.faithfulGodFather.id) {
        params['padrinoId'] = me.faithfulGodFather.id;
      }
      if (!!me.faithfulGodMother && !!me.faithfulGodMother.id) {
        params['madreId'] = me.faithfulGodMother.id;
      }

      me.certificateService.addCertificate(params);
    }
  }

  goToBaptismList() {
    const me = this;
    me.router.navigate(['sacraments', 'baptism']);
  }

  filterFaithfulData(event) {
    const me = this;
    me.faithfulData = me.allFaithful.filter(
      data => {
        return data.nombreCompleto.toLowerCase().indexOf(event.query.toLowerCase()) != -1;
      }
    );
  }

  filterWorkData(event) {
    const me = this;
    me.workData = me.works.filter(
      data => {
        return data.nombre.toLowerCase().indexOf(event.query.toLowerCase()) != -1;
      }
    );
  }

  filterJurisdictionData(event) {
    const me = this;
    me.jurisdictionData = me.jurisdictions.filter(
      data => {
        return data.jurisdiccion.toLowerCase().indexOf(event.query.toLowerCase()) != -1;
      }
    );
  }

  filterCelebrantPriestData(event) {
    const me = this;
    me.celebrantPriestData = me.priests.filter(
      data => {
        return data.nombre.toLowerCase().indexOf(event.query.toLowerCase()) != -1;
      }
    );
  }

  filterCertifyingPriestData(event) {
    const me = this;
    me.certifyingPriestData = me.priests.filter(
      data => {
        return data.nombre.toLowerCase().indexOf(event.query.toLowerCase()) != -1;
      }
    );
  }

  filterFatherData(event) {
    const me = this;
    me.faithfulFatherData = me.allFaithful.filter(
      data => {
        return data.nombreCompleto.toLowerCase().indexOf(event.query.toLowerCase()) != -1
          && (!!me.faithful.id && me.faithful.id != data.id)
          && data.genero == 'masculino';
      }
    );
  }

  filterMotherData(event) {
    const me = this;
    me.faithfulMotherData = me.allFaithful.filter(
      data => {
        return data.nombreCompleto.toLowerCase().indexOf(event.query.toLowerCase()) != -1
          && (!!me.faithful.id && me.faithful.id != data.id)
          && data.genero == 'femenino';
      }
    );
  }

  filterGodFatherData(event) {
    const me = this;
    me.faithfulGodFatherData = me.allFaithful.filter(
      data => {
        return data.nombreCompleto.toLowerCase().indexOf(event.query.toLowerCase()) != -1
          && (!!me.faithful.id && me.faithful.id != data.id)
          && data.genero == 'masculino';
      }
    );
  }

  filterGodMotherData(event) {
    const me = this;
    me.faithfulGodMotherData = me.allFaithful.filter(
      data => {
        return data.nombreCompleto.toLowerCase().indexOf(event.query.toLowerCase()) != -1
          && (!!me.faithful.id && me.faithful.id != data.id)
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
