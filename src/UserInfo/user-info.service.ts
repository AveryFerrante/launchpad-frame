import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable, of } from 'rxjs';
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
  private userInfoStore = UserInfoStore.getInstance();
  private userInfoHelper: UserInfoHelper;
  constructor(private db: AngularFirestore, private authService: AuthenticationService) {
    this.userInfoHelper = new UserInfoHelper(this.db);
  }

  get storeWatcher(): Observable<UserInfo> { return this.userInfoStore.getNonNullWatcher(); }
  get currentState(): UserInfo { return this.userInfoStore.getCurrent(); }

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
    if (username === null) {
      return of(null);
    }
    return this.userInfoHelper.searchUsername(username);
  }

  getUserInfo(userId: string) {
    return this.userInfoHelper.getUserInfo(userId).pipe(
      tap((userInfo: UserInfo) => this.userInfoStore.set(userInfo))
    );
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
