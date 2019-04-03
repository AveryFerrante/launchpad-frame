import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserInfo } from 'src/app/models/UserInfo';

@Injectable({
  providedIn: 'root'
})
export class UserInfoStore {
  // keep this immutable
  private readonly _userInfo = new BehaviorSubject<UserInfo>(null);
  readonly userInfo$ = this._userInfo.asObservable();
  constructor() { }

  // get last value emitted in _userinfo subject
  private get userInfo(): UserInfo {
    return this._userInfo.getValue();
  }

  private set userInfo(val: UserInfo) {
    this._userInfo.next(val);
  }

  set(info: UserInfo) {
    console.log('Store setting UserInfo value: ', info);
    this.userInfo = info;
  }

  clear() {
    this.userInfo = null;
  }

  addFrame(val: string) {
    const userInfo = new UserInfo(this.userInfo.firstName, this.userInfo.lastName, [...this.userInfo.ownedFrames, val]);
    this.userInfo = userInfo;
  }
}
