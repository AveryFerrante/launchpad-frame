import { Component, OnInit, Input } from '@angular/core';
import { FramesService } from 'src/app/services/frames/frames.service';
import { Observable, combineLatest } from 'rxjs';
import { finalize, map, first } from 'rxjs/operators';
import { ClientFrame } from 'src/app/models/client-side/ClientFrame';
import { UserInfoService } from 'src/app/services/userinfo/user-info.service';
import { UserInfo } from 'src/app/models/UserInfo';

@Component({
  selector: 'app-frame-image-viewer',
  templateUrl: './frame-image-viewer.component.html',
  styleUrls: ['./frame-image-viewer.component.css']
})
export class FrameImageViewerComponent implements OnInit {

  @Input() set frameId(id: string) {
    this._frameId = id;
    this.setFrameObservable();
  }
  private _frameId: string;
  public percentages$: Observable<number>;
  public frame$: Observable<ClientFrame>;
  public ownedFrameIds: string[];
  constructor(private framesService: FramesService, private userInfoService: UserInfoService) { }

  ngOnInit() {
    this.userInfoService.currentState.pipe(
      first((ui: UserInfo) => ui !== null),
      map((ui: UserInfo) => {
        const frameIds = [];
        for (const id in ui.frames) {
          if (ui.frames[id].role === 'owner') {
            frameIds.push(id);
          }
        }
        return frameIds;
      })
    ).subscribe((ids: string[]) => this.ownedFrameIds = ids);
    this.setFrameObservable();
  }

  setFrameObservable() {
    this.frame$ = this.framesService.getFrameData(this._frameId);
  }

  onFilesAdded(files: File[]) {
    const frameId = this._frameId; // Since this.frameId can change if the user switches frames during uplaod
    const percentagesTracker$: Observable<number>[] = [];
    for (const file of files) {
      const task = this.framesService.uploadImageToFrame(file, frameId);
      percentagesTracker$.push(task.percentageChanges());
    }

    this.percentages$ = combineLatest(percentagesTracker$).pipe(
      finalize(() => this.percentages$ = null),
      map((percentages: number[]) => {
        let result = 0;
        for (const percentage of percentages) {
          result = result + percentage;
        }
        return result / percentages.length;
      })
    );
  }

}
