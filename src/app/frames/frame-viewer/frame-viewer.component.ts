import { DOCUMENT } from '@angular/common';
import { Component, HostBinding, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, of, fromEvent } from 'rxjs';
import { catchError, switchMap, tap, filter, first } from 'rxjs/operators';
import { FramesService } from 'src/app/services/frames/frames.service';
import { ClientFrame } from '../../models/client-side/ClientFrame';
import { Errors } from '../../models/Errors';

@Component({
  selector: 'app-frame-viewer',
  templateUrl: './frame-viewer.component.html',
  styleUrls: ['./frame-viewer.component.css']
})
export class FrameViewerComponent implements OnInit {

  constructor(private framesService: FramesService, private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: any) { }

  elem: any;
  frame$: Observable<ClientFrame> = null;
  frameImageUrls: string[] = [];
  frameNotFound = false;
  showSlideshow = false;
  slideshowFullscreen = false;
  @HostBinding('class') classes = 'h-100 d-flex flex-column';
  ngOnInit() {
    this.elem = this.document.documentElement;
    this.frame$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => this.framesService.getFrameData(params.get('id')).pipe(
        tap((cf: ClientFrame) => {
          this.frameImageUrls = [];
          for (const img of cf.images) {
            this.frameImageUrls.push(img.downloadPath);
          }
        }),
        catchError((error: Error) => {
          if (error.message === Errors.InvalidFrameId) {
            this.frameNotFound = true;
            this.frame$ = null;
          } else {
            console.log(error.message);
          }
          return of(null);
        })
      )),
    );
    const self = this;
    this.document.addEventListener('fullscreenchange', () => {
      if (self.showSlideshow === false) {
        self.showSlideshow = true;
        self.slideshowFullscreen = true;
        setTimeout(self.setUpSlideshow, 100); /* THIS IS NOT GOOD....FIND A WAY TO TIE INTO THE ELEMENT CREATION */
      } else {
        self.slideshowFullscreen = false;
        self.showSlideshow = false;
      }
    });
    // this.document.addEventListener('webkitfullscreenchange', () => { this.onFullscreenExit(); });
    // this.document.addEventListener('mozfullscreenchange', () => { this.onFullscreenExit(); });
    // this.document.addEventListener('MSFullscreenChange', () => { this.onFullscreenExit(); });
  }

  setUpSlideshow() {
    const ss = document.getElementById('slideshow');
    ss.removeChild(ss.firstChild); // Removes 'X' in upper right
    const tags = ss.getElementsByTagName('a');
    for (let i = 0; i < tags.length; i++) {
      tags.item(i).removeAttribute('href');
      tags.item(i).removeAttribute('title');
      tags.item(i).style.cursor = 'none';
    }
  }
  onViewFrame() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    }
    // } else if (this.elem.mozRequestFullScreen) {
    //   /* Firefox */
    //   this.elem.mozRequestFullScreen();
    // } else if (this.elem.webkitRequestFullscreen) {
    //   /* Chrome, Safari and Opera */
    //   this.elem.webkitRequestFullscreen();
    // } else if (this.elem.msRequestFullscreen) {
    //   /* IE/Edge */
    //   this.elem.msRequestFullscreen();
    // }
  }
}
