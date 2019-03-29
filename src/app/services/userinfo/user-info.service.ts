import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserInfo } from 'src/app/models/UserInfo';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';
import { Observable, from } from 'rxjs';
import { map, concatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  private dbName: string;
  constructor(private db: AngularFirestore, private authService: AuthenticationService) {
    this.dbName = environment.userDatabase;
  }

  addNewUserInfo(info: UserInfo): Promise<void> {
    return this.db.collection(this.dbName).doc(this.authService.currentUser.uid).set(info.getData());
  }

  getUserInfo(): Observable<UserInfo> {
    // concatMap has a second parameter that can be a projection function. Look into removing the second pipe
    return this.authService.currentUser$.pipe(
      concatMap(user => {
        return this.db.collection(this.dbName).doc(user.uid).get().pipe(
          map((response) => {
            if (response.exists) {
              const data = response.data();
              return new UserInfo(data.firstName, data.lastName);
            } else {
              throw new Error('Userinfo does not exist for signed in user');
            }
          })
        );
      })
    );
  }

  // Assume uid has already been loaded in (can't call this on a refresh, etc.)
  addOwnedFrames(frameId: string): Observable<void> {
    return from(this.db.collection(this.dbName).doc(this.authService.currentUser.uid).set({
      // ownedFrames: firebase.firestore.FieldValue.arrayUnion(frameId)
    }));
  }
}
