import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserInfo } from 'src/app/models/UserInfo';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';
import { Observable, from } from 'rxjs';
import { map, mapTo, concatMap, tap } from 'rxjs/operators';
import { UserInfoStore } from '../stores/userinfostore.service';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  private dbName: string;
  constructor(private db: AngularFirestore, private authService: AuthenticationService, private store: UserInfoStore) {
    this.dbName = environment.userDatabase;
  }

  get currentState(): Observable<UserInfo> { return this.store.userInfo$; }

  addNewUserInfo(info: UserInfo): Observable<void> {
    return from(this.db.collection(this.dbName).doc(this.authService.currentUser.uid).set(info.getData())).pipe(
      tap(() => this.store.set(info))
    );
  }

  getUserInfo(): Observable<void> {
    return this.authService.currentUser$.pipe(
      concatMap((user: firebase.User) => this.db.collection(this.dbName).doc(user.uid).get()),
      map((response: firebase.firestore.DocumentSnapshot) => {
        if (response.exists) {
          const data = response.data();
          console.log('Recieved userinfo from DB: ', response.data());
          return new UserInfo(data.firstName, data.lastName, data.ownedFrames);
        } else {
          throw new Error('Userinfo does not exist for signed in user');
        }
      }),
      tap((user: UserInfo) => this.store.set(user)),
      mapTo(null)
    );
  }

  clearUserInfo(): void {
    this.store.clear();
  }

  // Doesn't update the user frame store right now, don't really need that front end since frame store is kept live
  addOwnedFrames(frameId: string): Observable<void> {
    return from(this.db.collection(this.dbName).doc(this.authService.currentUser.uid).update({
      ownedFrames: firebase.firestore.FieldValue.arrayUnion(frameId)
    }));
  }
}
