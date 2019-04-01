import { Component, OnInit, HostBinding } from '@angular/core';
import { FramesService } from 'src/app/services/frames/frames.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Frame } from 'src/app/models/Frame';

@Component({
  selector: 'app-frame-viewer',
  templateUrl: './frame-viewer.component.html',
  styleUrls: ['./frame-viewer.component.css']
})
export class FrameViewerComponent implements OnInit {

  constructor(private framesService: FramesService, private route: ActivatedRoute) { }

  frames$ = this.framesService.currentState;
  frame: Frame;
  @HostBinding('class.flex-grow-1') setTrue() { return true; }
  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => this.framesService.get(params.get('id')))
    ).subscribe((f: Frame) => this.frame = f);
  }

  onFilesAdded(files: File[]) {
    console.log(files);
  }

}
