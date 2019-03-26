import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Login } from '../models/client-side/Login';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { CreateAccount } from '../models/client-side/CreateAccount';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  showLoginForm: boolean;
  showCreateAccountForm: boolean;
  panelTitle: string;
  errorMessage: string;
  constructor(private activatedRoute: ActivatedRoute, private authService: AuthenticationService) { }

  ngOnInit() {
    this.activatedRoute.url.subscribe((u) => {
      if(u[0] && u[0].path === 'login') {
        this.showLoginForm = true;
        this.showCreateAccountForm = false;
        this.panelTitle = 'Login';
      } else if (u[0] && u[0].path === 'create-account') {
        this.showCreateAccountForm = true;
        this.showLoginForm = false;
        this.panelTitle = 'Create Account';
      }
    });
  }

  onLogin(login: Login) {
    console.log('login triggered');
      this.authService.signInWithEmail(login).then(
        resp => {
          // TODO
        },
        error => {
          const errorCode = error.code;
          if (errorCode === 'auth/wrong-password') {
            this.errorMessage = 'Email or password is incorrect.';
          } else if (errorCode === 'auth/user-not-found') {
            this.errorMessage = 'No matching user found for the provided email.';
          } else if (errorCode === 'auth/invalid-email') {
            this.errorMessage = 'Email is invalid.';
          } else if (errorCode === 'auth/user-disabled') {
            this.errorMessage = 'This account has been disabled.';
          } else { // This scenario shouldn't happen really

          }
        }
      );
    }

    onCreate(account: CreateAccount) {
      this.authService.createNewEmailAccount(account).then(
        resp => {
          // CREATE USER DOCUMENT
        },
        error => {
          const errorCode = error.Code;
          if(errorCode === 'auth/weak-password') {
            this.errorMessage = 'Password is not strong enough';
          }
        }
      )
    }
}
