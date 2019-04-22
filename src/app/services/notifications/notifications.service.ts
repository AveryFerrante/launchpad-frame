import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { environment } from '../../../environments/environment';
import { NotificationActions } from 'src/app/models/NotificationActions';
import { NotificationTypes } from 'src/app/models/NotificationTypes';
import { AuthenticationService } from '../authentication/authentication.service';
import { Notification } from 'src/app/models/Notification';
import { from, Observable } from 'rxjs';
import { NotificationsStore } from '../stores/notificationsstore.service';
import { UserInfoService } from '../userinfo/user-info.service';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { FrameUserInfoMetadata } from 'src/app/models/FrameUserInfoMetadata';
import { UserFrames, constructUserFrame } from 'src/app/models/UserFrames';
import { UserInfoStore } from '../stores/userinfostore.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private dbName = environment.notificationsDatabase;
  private frameDb = environment.frameDatabase;
  private frameUserSub = environment.frameUserSub;
  constructor(private db: AngularFirestore, private authService: AuthenticationService,
    private notificationsStore: NotificationsStore, private userInfoService: UserInfoService, private userInfoStore: UserInfoStore) { }

  addNewFrameNotifications(frameId: string, frameName: string, forusers: string[]): Observable<void> {
    const batch = this.db.firestore.batch();
    for (const user of forusers) {
      const notificationId = this.db.createId();
      const notification = new Notification(notificationId, NotificationActions.Added, frameId, frameName,
        this.authService.currentUser.uid, this.userInfoService.currentSnapshot.username, NotificationTypes.Frame, user);
      batch.set(this.db.collection(this.dbName).doc(notificationId).ref, notification.getData());
    }
    return from(batch.commit());
  }

  getNotificationListener(): Observable<Notification[]> {
    return this.notificationsStore.notificationsWatcher;
  }

  stopNotificationListener() {
    this.notificationsStore.stopNotificationWatcher();
  }

  acceptNotification(notification: Notification): Observable<void> {
    const frameUserInfoRef = this.db.collection(`${this.frameDb}/${notification.frameId}/${this.frameUserSub}`)
    .doc(`${notification.frameId}`).ref;
    const notificationRef = this.db.collection(this.dbName).doc(notification.id).ref;
    const batch = this.db.firestore.batch();

    const userFrame: UserFrames = constructUserFrame(notification.frameId, notification.frameName, 'participant');
    const updates = {};
    const frameUserInfo: FrameUserInfoMetadata = { username: this.userInfoService.currentSnapshot.username,
      role: 'participant', permissions: ['canaddimages'] };
    updates[`pendingUsers.${this.authService.currentUser.uid}`] = firebase.firestore.FieldValue.delete();
    updates[`users.${this.authService.currentUser.uid}`] = frameUserInfo;

    batch.update(frameUserInfoRef, updates);
    batch.delete(notificationRef);
    this.userInfoService.addFrameBatch(batch, userFrame);
    return from(batch.commit()).pipe(
      tap(() => {
        this.userInfoStore.addFrame(userFrame);
        this.notificationsStore.removeNotification(notification.id);
      })
    );
  }
}
