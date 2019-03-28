import { Component, OnInit } from '@angular/core';
import { FramesService } from 'src/app/services/frames/frames.service';
import { UserInfoService } from 'src/app/services/userinfo/user-info.service';
import { Frame } from 'src/app/models/Frame';
import { FramesStore } from 'src/app/services/stores/framesstore.service';
import { map } from 'rxjs/operators';
import { UserInfoStore } from 'src/app/services/stores/userinfostore.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  constructor(private frameService: FramesService, private userInfoService: UserInfoService,
    public framesStore: FramesStore, private userInfoStore: UserInfoStore) { }

  ngOnInit() {
  }

  onCreateNew() {
    this.frameService.add('Test Frame!', 'This is the first frame I have created').pipe(
      map((frame: Frame) => {
        this.framesStore.addFrame(frame);
        this.userInfoService.addOwnedFrames(frame.id).pipe(
          map(() => {
            this.userInfoStore.addFrame(frame.id);
          })
        );
      })
    );
  }

}
