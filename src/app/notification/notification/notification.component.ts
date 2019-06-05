import { Component, OnInit, Input } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import { Notification } from 'src/app/models/Notification';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  @Input() notification: Notification;
  constructor(private notificationsService: NotificationsService) { }

  ngOnInit() { }

  onAccept(notification: Notification) {
    this.notificationsService.acceptNotification(notification).subscribe(_ => console.log('accepted the notification..wow'));
  }

}
