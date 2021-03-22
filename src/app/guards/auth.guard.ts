import { Injectable } from '@angular/core';
import { Router, CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) {}
  canLoad(): Observable<boolean> {
    return this.authService.isAuth().pipe(
      tap((isAuth) => {
        console.log(isAuth);

        if (!isAuth) {
          this.router.navigate(['/login']);
        }
      }),
      take(1)
    );
  }
  /* canActivate(): Observable<boolean> {
    return this.authService.isAuth().pipe(
      tap((isAuth) => {
        if (!isAuth) {
          this.router.navigate(['/login']);
        }
      })
    );
  } */
}
