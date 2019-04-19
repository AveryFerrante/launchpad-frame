import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { NotificationsService } from '../services/notifications/notifications.service';
import { Observable, Subscription } from 'rxjs';
import { DocumentChangeAction } from '@angular/fire/firestore';
import { Notification } from 'src/app/models/Notification'; 
import { map } from 'rxjs/operators';

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
      map((newNotifications: DocumentChangeAction<Notification>[]) => {
        for (const n of newNotifications) {
          const data = n.payload.doc.data();
          this.notifications.push(new Notification(data.action, data.frameId, data.frameName, data.fromuser, data.type, data.foruser));
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
