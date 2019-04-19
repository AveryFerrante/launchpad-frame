import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification } from 'src/app/models/Notification';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { AuthenticationService } from '../authentication/authentication.service';
import { environment } from '../../../environments/environment';
import { map, tap } from 'rxjs/operators';
import { cloneDeep } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class NotificationsStore {

  private readonly _notifications = new BehaviorSubject<Notification[]>(null);
  readonly frames$ = this._notifications.asObservable();
  private dbName = environment.notificationsDatabase;
  constructor(private db: AngularFirestore, private authService: AuthenticationService) {
    this.db.collection<Notification>(this.dbName, (ref) => ref.where('foruser', '==', this.authService.currentUser.uid))
      .stateChanges(['added']).pipe(
        map((newNotifications: DocumentChangeAction<Notification>[]) => {
          console.log('Recieved a new notification');
          const notifications: Notification[] = [];
          for (const n of newNotifications) {
            const data = n.payload.doc.data();
            notifications.push(new Notification(n.payload.doc.id, data.action, data.frameId, data.frameName,
              data.fromuser, data.fromusername, data.type, data.foruser));
          }
          return notifications;
        }),
        tap((nots: Notification[]) => this.addNotifications(nots))
      ).subscribe();
  }

  private get notifications(): Notification[] {
    return this._notifications.getValue();
  }

  private set notifications(val: Notification[]) {
    this._notifications.next(val);
  }

  private addNotifications(newNotifications: Notification[]) {
    if (this.notifications != null) {
      const currentNotifications = cloneDeep(this.notifications);
      const newValue = [...currentNotifications, ...newNotifications];
      this.notifications = newValue;
    } else {
      this.notifications = newNotifications;
    }
  }

  public get notificationsWatcher(): Observable<Notification[]> {
    return this.frames$;
  }

  public removeNotification(id: string) {
    const notificationToRemove = this.notifications.filter(n => n.id === id);
    if (notificationToRemove.length > 0) {
      const notifications = cloneDeep(this.notifications);
      notifications.splice(notifications.indexOf(notificationToRemove[0]), 1);
      this.notifications = notifications;
    } else {
      throw new Error('No notification found matching id ' + id);
    }
  }
}
