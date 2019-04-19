import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import { Observable } from 'rxjs';
import { Notification } from 'src/app/models/Notification';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  constructor(private notificationsService: NotificationsService) { }

  notifications$: Observable<Notification[]>;
  ngOnInit() {
    this.notifications$ = this.notificationsService.getNotificationListener();
  }

  onAccept(notification: Notification) {
    this.notificationsService.acceptNotification(notification).subscribe(_ => console.log('accepted the notification..wow'));
  }
}
