import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Login } from 'src/app/models/client-side/Login';
import { CreateAccount } from 'src/app/models/client-side/CreateAccount';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private fireAuth: AngularFireAuth) { }

  signInWithEmail(login: Login): Promise<firebase.auth.UserCredential> {
    return this.fireAuth.auth.signInWithEmailAndPassword(login.email, login.password);
  }

  createNewEmailAccount(account: CreateAccount): Promise<firebase.auth.UserCredential> {
    return this.fireAuth.auth.createUserWithEmailAndPassword(account.email, account.password);
  }

  getCurrentUser(): firebase.User {
    return this.fireAuth.auth.currentUser;
  }
}
