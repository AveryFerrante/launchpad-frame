import { Component, Input, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { combineLatest, Observable } from 'rxjs';
import { finalize, first, map } from 'rxjs/operators';
import { ClientFrame } from 'src/app/models/client-side/ClientFrame';
import { UserInfo } from 'src/app/models/UserInfo';
import { FramesService } from 'src/app/services/frames/frames.service';
import { UserInfoService } from 'src/UserInfo/user-info.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-frame-image-viewer',
  templateUrl: './frame-image-viewer.component.html',
  styleUrls: ['./frame-image-viewer.component.css']
})
export class FrameImageViewerComponent implements OnInit {
  _frame: ClientFrame = null;
  public percentages$: Observable<number>;
  public ownedFrameIds: string[];
  public userId: string;
  @Input() set frame(frame: ClientFrame) { this._frame = frame; console.log(frame); }
  constructor(private framesService: FramesService, private userInfoService: UserInfoService, private notifierService: NotifierService,
    private authService: AuthenticationService) { }

  ngOnInit() {
    this.userId = this.authService.currentUser.uid;
    this.userInfoService.storeWatcher.pipe(
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
  }

  onFilesAdded(files: File[]) {
    const frameId = this._frame.id; // Since this.frameId can change if the user switches frames during uplaod
    const percentagesTracker$: Observable<number>[] = [];
    for (const file of files) {
      const task = this.framesService.uploadImageToFrame(file, frameId);
      percentagesTracker$.push(task.percentageChanges());
    }

    this.percentages$ = combineLatest(percentagesTracker$).pipe(
      finalize(() =>  {
        this.notifierService.notify('success', 'Image(s) added to the frame!');
        this.percentages$ = null;
      }),
      map((percentages: number[]) => {
        let result = 0;
        for (const percentage of percentages) {
          result = result + percentage;
        }
        return result / percentages.length;
      })
    );
  }

  onRemoveImage(imageId: string, frameImageId: string) {
    this.framesService.removeImageWorkflow(this._frame.id, imageId, frameImageId).subscribe({
     complete: () => this.notifierService.notify('success', 'Image has been removed from the frame')
    });
  }

}
