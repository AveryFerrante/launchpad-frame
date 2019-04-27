import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { UserInfoService } from '../../../UserInfo/user-info.service';
import { UserFrameMetadata } from '../../models/UserFramesMetadata';
import { UserInfo } from '../../models/UserInfo';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit, OnDestroy {

  @Input() set frames(val: UserInfo) { this.constructNavigationObject(val); }
  public _frames = [];
  constructor(private route: ActivatedRoute) { }

  ngOnInit() { }

  private constructNavigationObject(userInfo: UserInfo) {
    this._frames = [];
        for (const frameId in userInfo.frames) {
          const metaData: UserFrameMetadata = userInfo.frames[frameId];
          this._frames.push({
            name: metaData.name,
            id: frameId,
            role: metaData.role
        });
      }
  }

  ngOnDestroy() { }

}
