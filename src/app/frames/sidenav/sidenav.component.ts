import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { UserInfoService } from '../../../UserInfo/user-info.service';
import { UserFrameMetadata } from '../../models/UserFramesMetadata';
import { UserInfo } from '../../models/UserInfo';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit, OnDestroy {

  private userInfo$: Subscription = null;
  public frames = [];
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.userInfo$ = (this.route.snapshot.data['UserInfo'] as Observable<UserInfo>).subscribe((userInfo: UserInfo) => {
        this.frames = [];
        for (const frameId in userInfo.frames) {
          const metaData: UserFrameMetadata = userInfo.frames[frameId];
          this.frames.push({
            name: metaData.name,
            id: frameId
        });
      }
    });
  }

  ngOnDestroy() {
    this.userInfo$.unsubscribe();
  }

}
