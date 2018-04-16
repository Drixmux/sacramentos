import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { StoreModule } from '@ngrx/store';
import { account } from './reducers/account.reducer';
import { user } from './reducers/user.reducer';
import { certificate } from './reducers/certificate.reducer';
import { faithful } from './reducers/faithful.reducer';
import { work } from './reducers/work.reducer';

import { AppRoutingModule } from './app.routing.module';

import { AppComponent } from './app.component';
import { MainComponent } from './view/main/main.component';
import { SacramentsComponent } from './view/sacraments/sacraments.component';
import { HeaderComponent } from './view/sacraments/header/header.component';
import { SideBarComponent } from './view/sacraments/sideBar/sideBar.component';

import { FaithfulComponent } from './view/sacraments/faithfull/faithful.component';
import { FaithfulCreateComponent } from './view/sacraments/faithfull/faithfulCreate/faithfulCreate.component';
import { FaithfulUpdateComponent } from './view/sacraments/faithfull/faithfulUpdate/faithfulUpdate.component';

import { HomeComponent } from './view/sacraments/home/home.component';
import { BaptismComponent } from './view/sacraments/baptism/baptism.component';
import { BaptismCreateComponent } from './view/sacraments/baptism/baptismCreate/baptismCreate.component';

import { CommunionComponent } from './view/sacraments/communion/communion.component';
import { ConfirmationComponent } from './view/sacraments/confirmation/confirmation.component';
import { MarriageComponent } from './view/sacraments/marriage/marriage.component';

import { LoginComponent } from './view/login/login.component';

import { HttpService } from './services/http.service';
import { RedirectService } from './services/redirect.service';
import { AccountService } from './services/account.service';
import { UserService } from './services/user.service';
import { CertificateService } from './services/certificate.service';
import { FaithfulService } from './services/faithful.service';
import { WorkService } from './services/work.service';

import { AccountToolsService } from './utils/account.tools.service';
import { ConfirmationService } from 'primeng/api';

import { AppResolver } from './app.resolver';
import { MainResolver } from './resolvers/main.resolver';

import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { SliderModule } from 'primeng/slider';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ProgressBarModule } from 'primeng/progressbar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { GrowlModule } from 'primeng/growl';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


const SERVICES = [
  HttpService,
  RedirectService,
  AccountService,
  UserService,
  CertificateService,
  FaithfulService,
  WorkService
];

const UTILS = [
  AccountToolsService,
];

const PRIMENG_SERVICES = [
  ConfirmationService
];

const PRIMENG_MODULES = [
  TableModule,
  CardModule,
  SliderModule,
  ButtonModule,
  InputMaskModule,
  InputTextModule,
  DropdownModule,
  CalendarModule,
  AutoCompleteModule,
  ProgressBarModule,
  BreadcrumbModule,
  GrowlModule,
  ConfirmDialogModule
];
@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SacramentsComponent,
    HeaderComponent,
    SideBarComponent,
    FaithfulComponent,
    FaithfulCreateComponent,
    FaithfulUpdateComponent,
    HomeComponent,
    BaptismComponent,
    BaptismCreateComponent,
    CommunionComponent,
    ConfirmationComponent,
    MarriageComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    StoreModule.forRoot({
      account: account,
      user: user,
      certificate: certificate,
      faithful: faithful,
      work: work
    }),
    PRIMENG_MODULES
  ],
  providers: [
    AppResolver,
    MainResolver,
    SERVICES,
    PRIMENG_SERVICES,
    UTILS
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
