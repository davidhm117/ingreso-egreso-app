import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [],
})
export class DetalleComponent implements OnInit, OnDestroy {
  ingresosEgresos: IngresoEgreso[] = [];
  ieSubs: Subscription;

  constructor(
    private store: Store<AppState>,
    private ieService: IngresoEgresoService
  ) {}

  ngOnInit(): void {
    this.ieSubs = this.store
      .select('ingresosEgresos')
      .subscribe(({ items }) => (this.ingresosEgresos = items));
  }

  ngOnDestroy(): void {
    this.ieSubs.unsubscribe();
  }

  async borrar(uid: string) {
    try {
      await this.ieService.borrarIngresoEgreso(uid);
      Swal.fire('Borrado', 'Item borrado', 'success');
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  }
}
