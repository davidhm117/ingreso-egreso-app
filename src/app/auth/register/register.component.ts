import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [],
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
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
    const { password, nombre, correo } = this.form.value;
    try {
      await this.authService.crearUsuario(nombre, correo, password);
      this.router.navigate(['/']);
    } catch (err) {
      Swal.fire({
        title: 'Opsss. ',
        text: err.message,
        icon: 'error',
      });
    }
  }
}
