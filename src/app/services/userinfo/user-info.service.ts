import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';
import { Observable, from, of } from 'rxjs';
import { map, mapTo, tap } from 'rxjs/operators';
import { UserInfoStore } from '../stores/userinfostore.service';
import { UserInfo } from 'src/app/models/UserInfo';
import { UserFrames } from 'src/app/models/UserFrames';
import { Username } from 'src/app/models/Username';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  private userDb = environment.userDatabase;
  private usernameDb = environment.usernameDatabase;
  constructor(private db: AngularFirestore, private authService: AuthenticationService, private store: UserInfoStore) {
  }

  get currentState(): Observable<UserInfo> { return this.store.userInfo$; }
  get currentSnapshot(): UserInfo { return this.store.getCurrentSnapshot(); }

  addNewUserInfo(info: UserInfo): Observable<void> {
    const batch = this.db.firestore.batch();
    batch.set(this.db.collection(this.userDb).doc(this.authService.currentUser.uid).ref, info.getData());
    batch.set(this.db.collection(this.usernameDb).doc(this.db.createId()).ref, new Username(info.username,
        this.authService.currentUser.uid).getData());
    return from(batch.commit());
  }

  checkUsername(username: string): Observable<Username> {
    username = username.toLowerCase().trim();
    return from(this.db.collection(this.usernameDb, (ref) => ref.where('usernametrimmed', '==', username).limit(1)).get().pipe(
      map((val: firebase.firestore.QuerySnapshot) => {
        if (val.empty) {
          return null;
        } else if (val.docs[0].exists) {
          const data = val.docs[0].data();
          return new Username(data.username, data.userid);
        } else {
          return null;
        }
      })
    ));
  }

  initializeUserInfo(): Observable<void> {
    return from(this.db.collection(this.userDb).doc(this.authService.currentUser.uid).get().pipe(
      map((response: firebase.firestore.DocumentSnapshot) => {
        try {
          const data = response.data();
          return new UserInfo(data.username, data.firstName, data.lastName, data.email, data.frames);
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
    const docRef = this.db.firestore.doc(`${this.userDb}/${this.authService.currentUser.uid}`);
    return from(trans.get(docRef).then((doc) => {
      let frames = doc.get('frames') ? doc.get('frames') : {};
      frames = Object.assign(frames, userFrame);
      trans.set(docRef, { frames: frames }, { merge: true });
    }));
  }
}
