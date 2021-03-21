import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as uiActions from '../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [],
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  form: FormGroup;
  tipo: string = 'ingreso';
  loading: boolean = false;
  loadingSubs: Subscription;

  constructor(
    private fb: FormBuilder,
    private ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required],
    });
    this.loadingSubs = this.store.select('ui').subscribe((ui) => {
      this.loading = ui.isLoading;
    });
  }

  ngOnDestroy(): void {
    this.loadingSubs.unsubscribe();
  }

  async guardar() {
    if (this.form.invalid) {
      return;
    }
    this.store.dispatch(uiActions.isLoading());

    const { descripcion, monto } = this.form.value;
    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);
    try {
      const res = await this.ingresoEgresoService.crearIngresoEgreso(
        ingresoEgreso
      );
      this.form.reset();
      this.store.dispatch(uiActions.stopLoading());
      Swal.fire('Registro creado', descripcion, 'success');
    } catch (error) {
      this.store.dispatch(uiActions.stopLoading());
      Swal.fire('Error', error.message, 'error');
    }
  }
}
