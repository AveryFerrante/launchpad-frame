import { Component, OnInit, Input } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import { Notification } from 'src/app/models/Notification';
import { take } from 'rxjs/operators';

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
    this.notificationsService.acceptNotification(notification).pipe(take(1)).subscribe();
  }

}
