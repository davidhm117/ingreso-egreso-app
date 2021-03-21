import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import * as ui from '../../shared/ui.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit, OnDestroy {
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
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.uiSubscription = this.store.select('ui').subscribe((ui) => {
      this.loading = ui.isLoading;
      console.log('cargando subs');
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  async login() {
    if (this.form.invalid) {
      return;
    }

    this.store.dispatch(ui.isLoading());

    const { password, email } = this.form.value;
    try {
      await this.authService.login(email, password);
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
