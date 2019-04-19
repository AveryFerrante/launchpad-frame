import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { environment } from '../../../environments/environment';
import { NotificationActions } from 'src/app/models/NotificationActions';
import { NotificationTypes } from 'src/app/models/NotificationTypes';
import { AuthenticationService } from '../authentication/authentication.service';
import { Notification } from 'src/app/models/Notification';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private dbName = environment.notificationsDatabase;
  constructor(private db: AngularFirestore, private authService: AuthenticationService) { }

  addNewFrameNotifications(frameId: string, frameName: string, forusers: string[]): Observable<void> {
    const batch = this.db.firestore.batch();
    for (const user of forusers) {
      const notificationId = this.db.createId();
      const notification = new Notification(NotificationActions.Added, frameId, frameName,
        this.authService.currentUser.uid, NotificationTypes.Frame, user);
      batch.set(this.db.collection(this.dbName).doc(notificationId).ref, notification.getData());
    }
    return from(batch.commit());
  }

  getNotificationListener(): Observable<DocumentChangeAction<Notification>[]> {
    return this.db.collection<Notification>(this.dbName, (ref) => ref.where('foruser', '==', this.authService.currentUser.uid))
      .stateChanges(['added']);
  }
}
