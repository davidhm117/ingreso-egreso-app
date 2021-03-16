import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async login() {
    console.log(this.form.value);

    if (this.form.invalid) {
      return;
    }

    const { password, email } = this.form.value;
    try {
      await this.authService.login(email, password);
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
