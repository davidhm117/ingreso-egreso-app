import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as ui from '../../shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [],
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  uiSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private store: Store<AppState>,

    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.uiSubscription = this.store
      .select('ui')
      .subscribe((ui) => (this.loading = ui.isLoading));
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  isInvalid() {
    return this.form.invalid && this.form.touched;
  }

  isValid(field: string) {
    return this.form.get(field).valid && this.form.get(field).touched;
  }

  async crearUsuario() {
    if (this.form.invalid) {
      return;
    }
    this.store.dispatch(ui.isLoading());

    const { password, nombre, correo } = this.form.value;
    try {
      await this.authService.crearUsuario(nombre, correo, password);
      this.store.dispatch(ui.stopLoading());
      this.router.navigate(['/']);
    } catch (err) {
      this.store.dispatch(ui.stopLoading());
      Swal.fire({
        title: 'Opsss. ',
        text: err.message,
        icon: 'error',
      });
    }
  }
}
