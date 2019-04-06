import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';
import { Observable, from, of } from 'rxjs';
import { map, mapTo, tap } from 'rxjs/operators';
import { UserInfoStore } from '../stores/userinfostore.service';
import { UserInfo } from 'src/app/models/UserInfo';
import { UserFrames, constructUserFrame } from 'src/app/models/UserFrames';

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

  getAddFrameTransaction(trans: firebase.firestore.Transaction, userFrame: UserFrames): Observable<void> {
    const docRef = this.db.firestore.doc(`${this.dbName}/${this.authService.currentUser.uid}`);
    return from(trans.get(docRef).then((doc) => {
      let frames = doc.get('frames') ? doc.get('frames') : {};
      frames = Object.assign(frames, userFrame);
      trans.set(docRef, { frames: frames }, { merge: true });
    }));
  }

  // addFrame(frameId: string, name: string) {
  //   const docRef = this.db.firestore.doc(`${this.dbName}/${this.authService.currentUser.uid}`);
  //   return from(this.db.firestore.runTransaction((t) => {
  //     return t.get(docRef).then((doc) => {
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
