import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ToastModule, ToastOptions } from 'ng2-toastr';

import { StoreModule } from '@ngrx/store';
import { account } from './reducers/account.reducer';
import { user } from './reducers/user.reducer';
import { certificate } from './reducers/certificate.reducer';

import { AppRoutingModule } from './app.routing.module';

import { AppComponent } from './app.component';
import { MainComponent } from './view/main/main.component';
import { SacramentsComponent } from './view/sacraments/sacraments.component';
import { HeaderComponent } from './view/sacraments/header/header.component';
import { SideBarComponent } from './view/sacraments/sideBar/sideBar.component';

import { HomeComponent } from './view/sacraments/home/home.component';
import { BaptismComponent } from './view/sacraments/baptism/baptism.component';
import { CommunionComponent } from './view/sacraments/communion/communion.component';
import { ConfirmationComponent } from './view/sacraments/confirmation/confirmation.component';
import { MarriageComponent } from './view/sacraments/marriage/marriage.component';

import { LoginComponent } from './view/login/login.component';

import { HttpService } from './services/http.service';
import { RedirectService } from './services/redirect.service';
import { AccountService } from './services/account.service';
import { UserService } from './services/user.service';
import { CertificateService } from './services/certificate.service';

import { AppResolver } from './app.resolver';
import { MainResolver } from './resolvers/main.resolver';

import { TableModule } from 'primeng/table';
import { SliderModule } from 'primeng/slider';

export class ToastCustomOption extends ToastOptions {
  animate = 'fade'; // you can override any options available
  positionClass = 'toast-top-center';
  toastLife = 4000;
}

const SERVICES = [
  HttpService,
  RedirectService,
  AccountService,
  UserService,
  CertificateService
];

const PRIMENG_MODULES = [
  TableModule,
  SliderModule
];
@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SacramentsComponent,
    HeaderComponent,
    SideBarComponent,
    HomeComponent,
    BaptismComponent,
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
    ToastModule.forRoot(),
    AppRoutingModule,
    StoreModule.forRoot({
      account: account,
      user: user,
      certificate: certificate
    }),
    PRIMENG_MODULES
  ],
  providers: [
    AppResolver,
    MainResolver,
    SERVICES,
    {provide: ToastOptions, useClass: ToastCustomOption}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
