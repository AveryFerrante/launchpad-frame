import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserInfo } from 'src/app/models/UserInfo';
import { UserInfoService } from '../userinfo/user-info.service';
import { stringify } from '@angular/core/src/render3/util';

@Injectable({
  providedIn: 'root'
})
export class UserinfoStoreService {
  // keep this immutable
  private readonly _userInfo = new BehaviorSubject<UserInfo>(null);
  readonly userInfo$ = this._userInfo.asObservable();
  constructor(private userInfoService: UserInfoService) { }

  // get last value emitted in _userinfo subject
  get userInfo(): UserInfo {
    return this._userInfo.getValue();
  }

  set userInfo(val: UserInfo) {
    this._userInfo.next(val);
  }

  removeUserInfo() {
    this.userInfo = null;
  }

  initializeUserInfo() {
    this.userInfoService.getUserInfo().subscribe(response => {
      this.userInfo = response;
    }, error => {
      throw new Error('Error initializing userinfo');
    });
  }
}
