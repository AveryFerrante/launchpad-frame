import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserInfo } from 'src/app/models/UserInfo';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';
import { Observable } from 'rxjs';
import { map, concatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  constructor(private db: AngularFirestore, private authService: AuthenticationService) { }

  addNewUserInfo(info: UserInfo): Promise<void> {
    return this.db.collection(environment.userDatabase).doc(this.authService.currentUser.uid).set(info.getData());
  }

  getUserInfo(): Observable<UserInfo> {

    return this.authService.currentUser$.pipe(
      concatMap(user => {
        return this.db.collection(environment.userDatabase).doc(user.uid).get().pipe(
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
}
