import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UserInfoService } from '../services/userinfo/user-info.service';
import { UserInfo } from '../models/UserInfo';
import { UserFrameMetadata } from '../models/UserFramesMetadata';
import { skipWhile } from 'rxjs/operators';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit, OnDestroy {

  private userInfo$: Subscription = null;
  public frameNames: string[] = [];
  constructor(private userService: UserInfoService, private router: Router) { }

  ngOnInit() {
    this.userInfo$ = this.userService.currentState.pipe(
      skipWhile((u: UserInfo) => u == null),
    ).subscribe((userInfo: UserInfo) => {
        this.frameNames = [];
        for (const frameId in userInfo.frames) {
          const metaData: UserFrameMetadata = userInfo.frames[frameId];
          this.frameNames.push(metaData.name);
        }
      }
    );
  }

  onCreateNew() {
    this.router.navigate(['home', 'frames', 'create']);
  }

  viewFrame(id: string) {
    console.log('view frame', id);
    this.router.navigate(['home', 'frames', id]);
  }

  ngOnDestroy() {
    this.userInfo$.unsubscribe();
  }

}
