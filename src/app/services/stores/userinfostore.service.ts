import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserInfo } from 'src/app/models/UserInfo';
import { UserFrameMetadata } from 'src/app/models/UserFramesMetadata';
import { UserFrames } from 'src/app/models/UserFrames';

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

  addFrame(frame: UserFrames) {
    const userInfo = this.userInfo;
    const frames = userInfo.frames ? userInfo.frames : {};
    userInfo.frames = Object.assign(frames, frame);
    this.userInfo = userInfo;
  }
}
