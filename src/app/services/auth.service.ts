import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public auth: AngularFireAuth,
    public firestore: AngularFirestore,
    private router: Router
  ) {}

  initAuthListener() {
    this.auth.authState.subscribe((fuser) => {
      console.log(fuser?.uid);
      console.log(fuser?.email);
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
