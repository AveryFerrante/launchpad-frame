import { Component, OnInit, Input } from '@angular/core';
import { FramesService } from 'src/app/services/frames/frames.service';

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
    this.framesService.uploadImagesToFrame(files, this.frameId);
  }

}
