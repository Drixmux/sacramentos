import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { AccountService } from '../../../services/account.service';
import 'jquery';
import {Account, User} from '../../../app.store.model';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

// import {ToastsManager} from 'ng2-toastr/ng2-toastr';
// import {Observable} from "rxjs";

@Component({
  templateUrl: './sideBar.component.html',
  selector: 'ceb-side-bar'
})
export class SideBarComponent implements OnInit, OnDestroy, AfterViewInit {
  user$: Observable<User>;
  END_subscription$: Subject<boolean>;

  account: Account;

  constructor(
    private userService: UserService,
    private accountService: AccountService
  ) {
    const me = this;
    me.END_subscription$ = new Subject<boolean>();
    me.user$ = me.userService.user$.takeUntil(me.END_subscription$);

    me.account = null;
  }

  ngOnInit() {
    const me = this;
    me.user$.subscribe(
      data => {
        if (data && data['account']) {
          me.account = data['account'];
          me.initJquery();
        }
      }, error => {
        me.accountService.logOut({});
      }
    );
  }

  ngAfterViewInit() {
    const me = this;
    setTimeout(() => {
      me.initJquery();
    }, 1000);
  }

  ngOnDestroy() {
    const me = this;
    me.END_subscription$.next(true);
    me.END_subscription$.unsubscribe();
  }

  initJquery() {
    const $ = window['$'];
    $('.collapsible').collapsible();
    $('.sidebar-collapse').sideNav({
      edge: 'left',
    });
    $('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 125,
      constrain_width: true, // Does not change width of dropdown to that of the activator
      hover: false, // Activate on click
      alignment: 'left', // Aligns dropdown to left or right edge (works with constrain_width)
      gutter: 0, // Spacing from edge
      belowOrigin: true // Displays dropdown below the button
    });
  }

  logout() {
    const me = this;
    const userSession = window.sessionStorage.getItem('userSession');

    if (userSession) {
      window.sessionStorage.removeItem('userSession');
      me.account = null;
      me.accountService.logOut({});
    }
  }
}
