import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserCredentials } from 'src/app/models/client-side/UserCredentials';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  get currentUser$(): Observable<firebase.User> { return this.fireAuth.authState; }
  get currentUser(): firebase.User { return this.fireAuth.auth.currentUser; }
  constructor(private fireAuth: AngularFireAuth) { }

  signInWithEmail(login: UserCredentials): Promise<firebase.auth.UserCredential> {
    return this.fireAuth.auth.signInWithEmailAndPassword(login.email, login.password);
  }

  createNewEmailAccount(account: UserCredentials): Promise<firebase.auth.UserCredential> {
    return this.fireAuth.auth.createUserWithEmailAndPassword(account.email, account.password);
  }

  signOut(): Promise<void> {
    return this.fireAuth.auth.signOut();
  }
}
