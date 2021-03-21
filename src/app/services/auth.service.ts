import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import * as ieActions from '../ingreso-egreso/ingreso-egreso.actions';

import { Subscription } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSubs: Subscription;
  private _user: Usuario;

  get user() {
    return this._user;
  }
  constructor(
    public auth: AngularFireAuth,
    public firestore: AngularFirestore,
    private store: Store<AppState>,

    private router: Router
  ) {}

  initAuthListener() {
    this.auth.authState.subscribe((fuser) => {
      if (fuser) {
        //existe
        this.userSubs = this.firestore
          .doc(`${fuser.uid}/usuario`)
          .valueChanges()
          .subscribe((dbUser: any) => {
            const newUser = Usuario.fromFirebase(dbUser);
            this._user = newUser;
            this.store.dispatch(authActions.setUser({ user: newUser }));
          });
      } else {
        if (this.userSubs) {
          this.userSubs.unsubscribe();
        }
        this._user = null;
        this.store.dispatch(authActions.unSetUser());
        this.store.dispatch(ieActions.unSetItems());
      }
    });
  }

  isAuth() {
    return this.auth.authState.pipe(map((fuser) => fuser != null));
  }

  async crearUsuario(nombre: string, email: string, password: string) {
    const fUser = await this.auth.createUserWithEmailAndPassword(
      email,
      password
    );
    const { uid } = fUser.user;
    const newUser = new Usuario(uid, nombre, email);
    return this.firestore.doc(`${uid}/usuario`).set({ ...newUser });
  }

  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  async logout() {
    await this.auth.signOut();
    this.router.navigate(['/login']);
    return;
  }
}
