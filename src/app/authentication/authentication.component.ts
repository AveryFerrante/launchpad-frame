import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { CreateAccount } from '../models/client-side/CreateAccount';
import { UserCredentials } from '../models/client-side/UserCredentials';
import { UserInfoService } from '../services/userinfo/user-info.service';
import { UserInfoStore } from '../services/stores/userinfostore.service';
import { UserInfo } from '../models/UserInfo';

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
  constructor(private activatedRoute: ActivatedRoute, private authService: AuthenticationService,
    private userInfoService: UserInfoService, private router: Router, private userInfoStore: UserInfoStore) { }

  ngOnInit() {
    this.activatedRoute.url.subscribe((u) => {
      if (u[0] && u[0].path === 'login') {
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

  onLogin(login: UserCredentials) {
      this.authService.signInWithEmail(login).then(
        resp => {
          this.router.navigate(['/home']);
        },
        error => {
          const errorCode = error.code;
          if (errorCode === 'auth/wrong-password') {
            this.errorMessage = 'Email or password is incorrect.';
          } else if (errorCode === 'auth/user-not-found') {
            this.errorMessage = 'Email or password is incorrect.';
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
      this.authService.createNewEmailAccount(account.userCredentials).then(
        user => {
          const userInfo = new UserInfo(account.firstName, account.lastName);
          this.userInfoService.addNewUserInfo(userInfo).then(
            success => {
              this.router.navigate(['/home']);
            },
            error => {
              console.log(error);
            }
          );
        },
        error => {
          const errorCode = error.Code;
          if (errorCode === 'auth/weak-password') {
            this.errorMessage = 'Password is not strong enough';
          }
        }
      );
    }
}
