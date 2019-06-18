import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserInfo } from 'src/app/models/UserInfo';
import { UserFrameMetadata } from 'src/app/models/UserFramesMetadata';
import { UserInfoService } from 'src/UserInfo/user-info.service';
import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-frame-navigator',
  templateUrl: './frame-navigator.component.html',
  styleUrls: ['./frame-navigator.component.css']
})
export class FrameNavigatorComponent implements OnInit, OnDestroy {

  public frames = [];
  userInfoSubscription: Subscription;
  constructor(private userInfoService: UserInfoService) { }

  ngOnInit() {
    this.userInfoSubscription = this.userInfoService.storeWatcher.pipe(
      tap(() => console.log('frame-navigator: recieved userinfo object: ')),
      tap(console.log),
      tap((userInfo: UserInfo) => this.constructNavigationObject(userInfo))
    ).subscribe();
  }

  private constructNavigationObject(userInfo: UserInfo) {
    this.frames = [];
    for (const frameId in userInfo.frames) {
      const metaData: UserFrameMetadata = userInfo.frames[frameId];
      this.frames.push({
        name: metaData.name,
        id: frameId,
        role: metaData.role
      });
    }
  }

  ngOnDestroy() {
    this.userInfoSubscription.unsubscribe();
  }

}
