import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
// import {Observable} from "rxjs";

@Component({
  templateUrl: './main.component.html'
})
export class MainComponent implements OnInit, OnDestroy {


  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    const me = this;
  }

  ngOnInit() {
    const me = this;
    me.route.data.subscribe(
      data => {
        me.router.navigate(['sacraments', 'home']);
      }
    );
    me.router.events.subscribe(
      data => {
      }
    );
  }

  ngOnDestroy() {
    const me = this;
  }

}
