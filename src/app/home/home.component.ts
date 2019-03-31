import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { Router } from '@angular/router';
import { UserInfoService } from '../services/userinfo/user-info.service';
import { UserInfo } from '../models/UserInfo';
import { concatMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  public userInfo$: Observable<UserInfo> = null;
  constructor(private authService: AuthenticationService, private router: Router, private userInfo: UserInfoService) { }

  ngOnInit() {
    this.userInfo$ = this.userInfo.currentState;
    this.userInfo.currentState.pipe(
      concatMap((state: UserInfo) => {
        if (state == null) {
          return this.userInfo.getUserInfo();
        } else {
          return of();
        }
      }),
      take(1)
    )
    .subscribe({error: (error) => console.log('Error onInit home component:', error), complete: () => console.log('completed home init')});
  }

  onLogout() {
    this.authService.signOut().subscribe(
      () => this.router.navigate(['/login'])
    );
  }

  ngOnDestroy() {
    this.userInfo.clearUserInfo();
  }

}
