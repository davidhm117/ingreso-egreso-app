import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import * as ieActions from '../ingreso-egreso/ingreso-egreso.actions';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [],
})
export class DashboardComponent implements OnInit, OnDestroy {
  userSubs: Subscription;
  ieSubs: Subscription;
  constructor(
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService
  ) {}

  ngOnInit(): void {
    this.userSubs = this.store
      .select('auth')
      .pipe(filter(({ user }) => user != null))
      .subscribe(({ user }) => {
        this.ieSubs = this.ingresoEgresoService
          .initIngresosEgresosListener(user.userId)
          .subscribe((ingresosEgresos) => {
            this.store.dispatch(ieActions.setItems({ items: ingresosEgresos }));
          });
      });
  }

  ngOnDestroy(): void {
    this.userSubs?.unsubscribe();
    this.ieSubs?.unsubscribe();
  }
}
