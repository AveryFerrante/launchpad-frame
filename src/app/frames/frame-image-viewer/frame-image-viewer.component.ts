import { Component, OnInit, Input } from '@angular/core';
import { FramesService } from 'src/app/services/frames/frames.service';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-frame-image-viewer',
  templateUrl: './frame-image-viewer.component.html',
  styleUrls: ['./frame-image-viewer.component.css']
})
export class FrameImageViewerComponent implements OnInit {

  @Input() frameId: string;
  constructor(private framesService: FramesService) { }

  ngOnInit() {
  }


  onFilesAdded(files: File[]) {
    const frameId = this.frameId; // Since this.frameId can change if the user switches frames during uplaod
    for (const file of files) {
      const task = this.framesService.uploadImageToFrame(file);
      task.on('state_changed',
        {
          next: (value: firebase.storage.UploadTaskSnapshot) => console.log(),
          error: (error: Error) => console.log(),
          complete: () => {
            from(task.snapshot.ref.getDownloadURL()).pipe(
              mergeMap((dl: string) => this.framesService.newImageWorkflow(frameId, dl)
              )).subscribe({
                error: (e: Error) => console.log(e),
                complete: () => console.log('Success!')
              });
          }
        }
      );
    }
  }

}
