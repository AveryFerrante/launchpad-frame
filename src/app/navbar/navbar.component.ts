import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { NotificationsService } from '../services/notifications/notifications.service';
import { Observable, Subscription } from 'rxjs';
import { DocumentChangeAction } from '@angular/fire/firestore';
import { Notification } from 'src/app/models/Notification';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthenticationService, private router: Router, private notificationService: NotificationsService) { }

  notifications$: Subscription;
  notifications: Notification[] = [];
  ngOnInit() {
    this.notifications$ = this.notificationService.getNotificationListener().pipe(
      tap((notifications: Notification[]) =>  {
        if (notifications != null) {
          this.notifications = notifications;
        }
      })
    ).subscribe();
  }

  onLogout() {
    this.authService.signOut().subscribe(
      () => this.router.navigate(['login'])
    );
  }

  ngOnDestroy() {
    this.notifications$.unsubscribe();
  }

}
