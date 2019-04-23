import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { flatMap, tap } from 'rxjs/operators';
import { UserInfo } from 'src/app/models/UserInfo';
import { UserInfoService } from 'src/UserInfo/user-info.service';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserInfoResolveService implements Resolve<Observable<Observable<UserInfo>>> {

  constructor(private userInfoService: UserInfoService, private authService: AuthenticationService) { }

  resolve(): Observable<Observable<UserInfo>> {
    if (this.userInfoService.currentState === null) {
      return this.userInfoService.getUserInfo(this.authService.currentUser.uid).pipe(
        flatMap(() => new Observable(this.getStoreSnapshot.bind(this)) as Observable<Observable<UserInfo>>)
      );
    } else {
      return new Observable(this.getStoreSnapshot.bind(this)) as Observable<Observable<UserInfo>>;
    }
  }

  getStoreSnapshot(observer: any) {
    observer.next(this.userInfoService.storeWatcher);
    observer.complete();
  }
}
