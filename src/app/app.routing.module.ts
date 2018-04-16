import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './view/main/main.component';
import { SacramentsComponent } from './view/sacraments/sacraments.component';
import { LoginComponent } from './view/login/login.component';
import { HomeComponent } from './view/sacraments/home/home.component';
import { FaithfulComponent } from './view/sacraments/faithfull/faithful.component';
import { FaithfulCreateComponent } from './view/sacraments/faithfull/faithfulCreate/faithfulCreate.component';
import { FaithfulUpdateComponent } from './view/sacraments/faithfull/faithfulUpdate/faithfulUpdate.component';
import { BaptismComponent } from './view/sacraments/baptism/baptism.component';
import { BaptismCreateComponent } from './view/sacraments/baptism/baptismCreate/baptismCreate.component';
import { CommunionComponent } from './view/sacraments/communion/communion.component';
import { ConfirmationComponent } from './view/sacraments/confirmation/confirmation.component';
import { MarriageComponent } from './view/sacraments/marriage/marriage.component';

import { AppResolver } from './app.resolver';
import { MainResolver } from './resolvers/main.resolver';

const APP_ROUTES: Routes = [
  {
    path: '',
    component: MainComponent,
    resolve: {
      userSession: AppResolver
    },
    children: [
      {
        path: 'sacraments',
        component: SacramentsComponent,
        resolve: {
          userSession: MainResolver
        },
        children: [
          {
            path: 'home',
            component: HomeComponent,
            resolve: {
              userSession: MainResolver
            }
          }, {
            path: 'faithful',
            component: FaithfulComponent,
            resolve: {
              userSession: MainResolver
            }
          }, {
            path: 'faithful/create',
            component: FaithfulCreateComponent,
            resolve: {
              userSession: MainResolver
            }
          }, {
            path: 'faithful/update/:faithfulId',
            component: FaithfulUpdateComponent,
            resolve: {
              userSession: MainResolver
            }
          }, {
            path: 'baptism',
            component: BaptismComponent,
            resolve: {
              userSession: MainResolver
            }
          }, {
            path: 'baptism/create',
            component: BaptismCreateComponent,
            resolve: {
              userSession: MainResolver
            }
          }, {
            path: 'communion',
            component: CommunionComponent,
            resolve: {
              userSession: MainResolver
            }
          }, {
            path: 'confirmation',
            component: ConfirmationComponent,
            resolve: {
              userSession: MainResolver
            }
          }, {
            path: 'marriage',
            component: MarriageComponent,
            resolve: {
              userSession: MainResolver
            }
          }
        ]
      }, {
        path: 'login',
        component: LoginComponent,
        resolve: {
          userSession: MainResolver
        }
      }
    ]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

const appRouting = RouterModule.forRoot(APP_ROUTES, {
  useHash: true
});

@NgModule({
  imports: [ appRouting ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
