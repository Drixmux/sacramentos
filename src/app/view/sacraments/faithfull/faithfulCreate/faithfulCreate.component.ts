import { Component, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import { Account, User, Faithful, Header } from '../../../../app.store.model';
import { Observable } from 'rxjs/Observable';

import { UserService } from '../../../../services/user.service';
import { AccountService } from '../../../../services/account.service';
import { FaithfulService } from '../../../../services/faithful.service';
import { LOAD_ALL_FAITHFUL, CREATE_FAITHFUL } from '../../../../reducers/faithful.reducer';

import { ValidateUtil } from '../../../../utils/validate.service';

import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import { SelectItem } from 'primeng/api';

// import {Observable} from "rxjs";

@Component({
  templateUrl: './faithfulCreate.component.html'
})
export class FaithfulCreateComponent implements OnInit, OnDestroy {
  user$: Observable<User>;
  faithful$: Observable<Faithful[]>;
  END_subscription$: Subject<boolean>;

  account: Account;
  headers: Header[];
  currFaithful: Faithful;
  calendarEs: any;
  faithful: Faithful[];
  faithfulFather: any;
  faithfulFatherData: any[];
  faithfulMother: any;
  faithfulMotherData: any[];
  genre: SelectItem[];

  loading: Boolean;

  constructor(
    private toastr: ToastsManager,
    private vcr: ViewContainerRef,
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

    me.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    const me = this;
    setTimeout(() => {
      me.initJquery();
    }, 1000);
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
              me.faithful = data['payload']['faithful'];
            }
            break;
          case CREATE_FAITHFUL:
            if (data['payload'] && data['payload']['status'] && data['payload']['status'] == 'success') {
              me.loading = false;
              me.faithful = data['payload']['faithful'];
              me.router.navigate(['sacraments', 'faithful']);
            } else if(data['payload'] && data['payload']['status'] && data['payload']['status'] == 'error' && data['payload']['msg']) {
              me.toastr.error(data['payload']['msg']);
              me.loading = false;
            }
            break;
        }
      }
    );
  }

  ngOnDestroy() {
    const me = this;
    me.END_subscription$.next(true);
    me.END_subscription$.unsubscribe();
  }

  initJquery() {
    const me = this;
    const $ = window['$'];
    /*$('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year,
      today: 'Today',
      clear: 'Clear',
      close: 'Ok',
      closeOnSelect: false, // Close upon selecting a date,
      container: undefined, // ex. 'body' will append picker to body
    });
    $('select').material_select();
    */
    me.initAutocompleteInput();
  }

  initAutocompleteInput() {
    const $ = window['$'];
    const data = [{
      'id': 1,
      'name': 'person 1',
      'label': 'person 1'
    }, {
      'id': 2,
      'name': 'person 2',
      'label': 'person 2'
    }];
    $('input.autocomplete-padre').autocomplete({
      source: data,
      minLength: 1,
      select: function( event, ui ) {
        console.log('padre: ', ui.item);
      }
    });
    $('input.autocomplete-madre').autocomplete({
      source: data,
      minLength: 1,
      select: function( event, ui ) {
        console.log('madre: ', ui.item);
      }
    });
    $('input.autocomplete-padrino').autocomplete({
      source: data,
      minLength: 1,
      select: function( event, ui ) {
        console.log('padrino: ', ui.item);
      }
    });
    $('input.autocomplete-madrina').autocomplete({
      source: data,
      minLength: 1,
      select: function( event, ui ) {
        console.log('madrina: ', ui.item);
      }
    });
  }

  validateData(record: Faithful) {
    const me = this;

    if (!ValidateUtil.nonEmpty(me.currFaithful.nombres)) {
      me.toastr.warning('El campo de nombres es obligatorio.');
      return false;
    }

    if (!ValidateUtil.nonEmpty(me.currFaithful.apellidoPaterno)) {
      me.toastr.warning('El campo de apellido paterno es obligatorio.');
      return false;
    }

    if (!ValidateUtil.nonEmpty(me.currFaithful.apellidoMaterno)) {
      me.toastr.warning('El campo de apellido materno es obligatorio.');
      return false;
    }

    if (!ValidateUtil.nonEmpty(me.currFaithful.fechaNacimiento)) {
      me.toastr.warning('El campo de fecha de nacimiento es obligatorio.');
      return false;
    }

    if (!ValidateUtil.nonEmpty(me.currFaithful.procedencia)) {
      me.toastr.warning('El campo de procedencia es obligatorio.');
      return false;
    }

    if (!ValidateUtil.nonEmpty(me.currFaithful.genero)) {
      me.toastr.warning('El campo de género es obligatorio.');
      return false;
    }

    if (!ValidateUtil.nonEmpty(me.currFaithful.birthCertificate.orc)) {
      me.toastr.warning('El campo de ORC es obligatorio.');
      return false;
    }

    if (!ValidateUtil.nonEmpty(me.currFaithful.birthCertificate.libro)) {
      me.toastr.warning('El campo de libro es obligatorio.');
      return false;
    }

    if (!ValidateUtil.nonEmpty(me.currFaithful.birthCertificate.partida)) {
      me.toastr.warning('El campo de partida es obligatorio.');
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

  addFaithful() {
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

  filterFatherData(event) {
    const me = this;
    me.faithfulFatherData = me.faithful.filter(
      data => {
        return data.nombreCompleto.toLowerCase().indexOf(event.query.toLowerCase()) != -1 && parseInt(me.account.sub, 10) != data.id;
      }
    );
  }

  filterMotherData(event) {
    const me = this;
    me.faithfulMotherData = me.faithful.filter(
      data => {
        return data.nombreCompleto.toLowerCase().indexOf(event.query.toLowerCase()) != -1 && parseInt(me.account.sub, 10) != data.id;
      }
    );
  }
}
