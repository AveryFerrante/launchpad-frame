import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { combineLatest, Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { ClientFrame } from 'src/app/models/client-side/ClientFrame';
import { GroupedFrameImages } from 'src/app/models/client-side/GroupedFrameImages';
import { UserInfo } from 'src/app/models/UserInfo';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { FramesService } from 'src/app/services/frames/frames.service';
import { groupBy, Dictionary } from 'lodash';
import { FrameImage } from 'src/app/models/FrameImage';

@Component({
  selector: 'app-frame-image-viewer',
  templateUrl: './frame-image-viewer.component.html',
  styleUrls: ['./frame-image-viewer.component.css']
})
export class FrameImageViewerComponent implements OnInit {
  _frame: ClientFrame = null;
  groupedImages: GroupedFrameImages[] = [];
  public percentages$: Observable<number>;
  public ownedFrameIds: string[];
  public userId: string;
  @Input() set frame(frame: ClientFrame) {
    this._frame = frame;
    this.groupImages();
  }
  constructor(private framesService: FramesService, private router: ActivatedRoute, private notifierService: NotifierService,
    private authService: AuthenticationService) { }

  ngOnInit() {
    this.userId = this.authService.currentUser.uid;
    (this.router.snapshot.data['UserInfo'] as Observable<UserInfo>).pipe(
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

  groupImages() {
    // const group = groupBy(this._frame.images, (img: FrameImage) => img.dateAdded.toLocaleDateString());
    const group = groupBy(this._frame.images, (img: FrameImage) => img.addedBy);
    this.groupedImages = Object.keys(group).map(key => ({ key: key, Images: group[key] }));
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

  onRemoveImage(imageId: string, frameImageId: string, userId: string) {
    this.framesService.removeImageWorkflow(this._frame.id, imageId, frameImageId, userId).subscribe({
     complete: () => this.notifierService.notify('success', 'Image has been removed from the frame')
    });
  }

}
