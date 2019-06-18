import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { Notification } from 'src/app/models/Notification';
import { UserInfoService } from 'src/UserInfo/user-info.service';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { FramesService } from '../services/frames/frames.service';
import { NotificationsService } from '../services/notifications/notifications.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  private _userInfoService: UserInfoService;
  private _framesService: FramesService;

  constructor(private authService: AuthenticationService, private router: Router,
    private notificationService: NotificationsService, userInfoService: UserInfoService, framesService: FramesService) {
      this._userInfoService = userInfoService;
      this._framesService = framesService;
    }

  notificationsSubscription: Subscription;
  notifications: Notification[] = [];
  showHamburger = false;
  ngOnInit() {
    this.notificationsSubscription = this.notificationService.getNotificationListener().pipe(
      filter((n: Notification[]) => n != null),
      tap((notifications: Notification[]) =>  this.notifications = notifications)
    ).subscribe();
  }

  onLogout() {
    this.notificationService.stopNotificationListener();
    this.authService.signOut().subscribe(
      () => {
        this._userInfoService.clearUserInfo();
        this._framesService.clearFrames();
        this.router.navigate(['login']);
      }
    );
  }

  onHamburgerNav() {
    this.showHamburger = true;
  }

  ngOnDestroy() {
    this.notificationsSubscription.unsubscribe();
  }

}
