import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, mapTo, tap } from 'rxjs/operators';
import { CreateAccount } from '../models/client-side/CreateAccount';
import { UserCredentials } from '../models/client-side/UserCredentials';
import { UserInfo } from '../models/UserInfo';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { UserInfoService } from '../../UserInfo/user-info.service';
import { GlobalEventsService } from '../services/global/global-events.service';

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
    private userInfoService: UserInfoService, private router: Router, private globalEventService: GlobalEventsService) { }

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
      this.authService.signInWithEmail(login).subscribe(
        () => {
          this.globalEventService.showNavBar(true);
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
            this.errorMessage = 'Unknown error occured. Please try again';
          }
        }
      );
    }

    onCreate(account: CreateAccount) {
      this.authService.createNewEmailAccount(account.userCredentials).pipe(
        mapTo(new UserInfo(account.username, account.firstName, account.lastName, account.userCredentials.email)),
        concatMap((userInfo: UserInfo) => this.userInfoService.addNewUserInfo(userInfo)))
        .subscribe(
          () => {
            this.globalEventService.showNavBar(true);
            this.router.navigate(['/home']);
          },
          (error) => {
            if (error.code === 'auth/weak-password') {
              this.errorMessage = 'Password is not strong enough';
            } else {
              this.errorMessage = 'Email is already in use';
            }
          }
        );
    }
}
