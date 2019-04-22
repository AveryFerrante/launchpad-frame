import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { map, mapTo, tap } from 'rxjs/operators';
import { UserFrames } from 'src/app/models/UserFrames';
import { UserInfo } from 'src/app/models/UserInfo';
import { Username } from 'src/app/models/Username';
import { AuthenticationService } from '../app/services/authentication/authentication.service';
import { environment } from '../environments/environment';
import { UserInfoStore } from './UserInfoStore';
import { UserInfoHelper } from './UserInfoHelper';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  private userDb = environment.userDatabase;
  private usernameDb = environment.usernameDatabase;
  private userInfoStore = UserInfoStore.getInstance();
  private userInfoHelper: UserInfoHelper;
  constructor(private db: AngularFirestore, private authService: AuthenticationService) {
    this.userInfoHelper = new UserInfoHelper(this.db);
  }

  get currentState(): Observable<UserInfo> { return this.userInfoStore.getWatcher(); }
  get currentSnapshot(): UserInfo { return this.userInfoStore.getCurrent(); }

  addNewUserInfo(info: UserInfo): Observable<void> {
    const userId = this.authService.currentUser.uid;
    const username = new Username(info.username, userId);
    const batch = this.db.firestore.batch();
    this.userInfoHelper.newUserInfoBatch(batch, userId, info);
    this.userInfoHelper.newUsernameBatch(batch, username);
    return from(batch.commit()).pipe(
      tap(_ => this.userInfoStore.set(info))
    );
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
    if (this.userInfoStore.getCurrent() === null) {
      return from(this.db.collection(this.userDb).doc(this.authService.currentUser.uid).get().pipe(
        map((response: firebase.firestore.DocumentSnapshot) => {
          try {
            const data = response.data();
            return new UserInfo(data.username, data.firstName, data.lastName, data.email, data.frames);
          } catch {
            throw new Error('Userinfo does not exist for signed in user');
          }
        }),
        tap((user: UserInfo) => this.userInfoStore.set(user)),
        mapTo(null)
      ));
    }
  }

  addFrameBatch(batch: firebase.firestore.WriteBatch, frames: UserFrames) {
    const docRef = this.db.firestore.doc(`${this.userDb}/${this.authService.currentUser.uid}`);
    const updates = {
      frames // this relies on the variable being named 'frames'
    };
    batch.set(docRef, updates, { merge: true });
  }

  // UserInfoStore wrappers
  clearUserInfo(): void {
    this.userInfoStore.clear();
  }

  addFrame(frame: UserFrames) {
    this.userInfoStore.addFrame(frame);
  }
}
