import { Component, OnInit } from '@angular/core';
import { FramesService } from 'src/app/services/frames/frames.service';
import { UserInfoService } from 'src/app/services/userinfo/user-info.service';
import { Frame } from 'src/app/models/Frame';
import { concatMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  public frames$: Observable<Frame[]> = null;
  constructor(private frameService: FramesService, private userInfoService: UserInfoService) { }

  ngOnInit() {
    this.frames$ = this.frameService.currentState;
  }

  onCreateNew() {
    this.frameService.add('Test Frame!', 'This is the first frame I have created').pipe(
      concatMap((frameId: string) => this.userInfoService.addOwnedFrames(frameId))
    ).subscribe();
  }

}
