import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';
import { Observable, from, of } from 'rxjs';
import { map, mapTo, concatMap, tap } from 'rxjs/operators';
import { UserInfoStore } from '../stores/userinfostore.service';
import * as firebase from 'firebase';
import { UserInfo } from 'src/app/models/UserInfo';
import { UserFrames } from 'src/app/models/UserFrames';
import { FrameImageMetadata } from 'src/app/models/FrameImageMetadata';
import { UserFrameMetadata } from 'src/app/models/UserFramesMetadata';

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

  initializeUserInfo(): Observable<void> {
    return from(this.db.collection(this.dbName).doc(this.authService.currentUser.uid).get().pipe(
      map((response: firebase.firestore.DocumentSnapshot) => {
        try {
          const data = response.data();
          return new UserInfo(data.firstName, data.lastName, data.email, data.frames);
        } catch {
          throw new Error('Userinfo does not exist for signed in user');
        }
      }),
      tap((user: UserInfo) => this.store.set(user)),
      mapTo(null)
    ));
  }

  clearUserInfo(): void {
    this.store.clear();
  }

  getAddFrameTransaction(trans: firebase.firestore.Transaction, frameId: string, role: string): firebase.firestore.Transaction {
    const docRef = this.db.firestore.doc(`${this.dbName}/${this.authService.currentUser.uid}`);
    trans.get(docRef).then((doc) => {
      const frames = doc.get('frames') ? doc.get('frames') : {};
      frames[frameId] = {
        name: name,
        role: role
      };
      trans.set(docRef, { frames: frames }, { merge: true });
    });
    return trans;
  }

  // addFrame(frameId: string, name: string): Observable<void> {
  //   const docRef = this.db.firestore.doc(`${this.dbName}/${this.authService.currentUser.uid}`);
  //   return from(this.db.firestore.runTransaction((t) => {
  //     t.get(docRef).then((doc) => {
  //       const frames = doc.get('frames') ? doc.get('frames') : {};
  //       frames[frameId] = {
  //         name: name,
  //         userId: this.authService.currentUser.uid
  //       };
  //       t.set(docRef, { frames: frames }, { merge: true });
  //     });
  //   }));
  // }
}
