import { DOCUMENT } from '@angular/common';
import { Component, HostBinding, Inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { FramesService } from 'src/app/services/frames/frames.service';
import { ClientFrame } from '../../models/client-side/ClientFrame';
import { Errors } from '../../models/Errors';

@Component({
  selector: 'app-frame-viewer',
  templateUrl: './frame-viewer.component.html',
  styleUrls: ['./frame-viewer.component.css']
})
export class FrameViewerComponent implements OnInit, OnDestroy {

  constructor(private framesService: FramesService, private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document) { }

  elem: any;
  frame$: Observable<ClientFrame> = null;
  frameImageUrls: string[] = [];
  frameNotFound = false;
  showSlideshow = false;
  slideshowFullscreen = false;
  private fsEventHandler: any = this.onFullscreenChange.bind(this);
  @HostBinding('class') classes = 'h-100 d-flex flex-column';
  ngOnInit() {
    this.elem = this.document.documentElement;
    this.initFrameObservable();
    this.document.addEventListener('fullscreenchange', this.fsEventHandler);
    this.document.addEventListener('mozfullscreenchange', this.fsEventHandler);
    this.document.addEventListener('webkitfullscreenchange', this.fsEventHandler);
    this.document.addEventListener('mozfullscreenchange', this.fsEventHandler);
    this.document.addEventListener('MSFullscreenChange', this.fsEventHandler);
  }

  private initFrameObservable() {
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
            console.error(error.message);
          }
          return of(null);
        })
      )),
    );
  }

  setUpSlideshow() {
    const ss = this.document.querySelector('#slideshow');
    ss.removeChild(ss.firstChild); // Removes 'X' in upper right
    const tags = ss.getElementsByTagName('a');
    for (let i = 0; i < tags.length; i++) {
      tags.item(i).removeAttribute('href');
      tags.item(i).removeAttribute('title');
      tags.item(i).style.cursor = 'none';
      setTimeout(() => tags.item(i).style.backgroundSize = 'stretch', 500);
    }
  }

  onFullscreenChange() {
    if (this.showSlideshow === false) {
      this.showSlideshow = true;
      this.slideshowFullscreen = true;
      setTimeout(this.setUpSlideshow, 100); /* THIS IS NOT GOOD....FIND A WAY TO TIE INTO THE ELEMENT CREATION */
    } else {
      this.slideshowFullscreen = false;
      this.showSlideshow = false;
    }
  }

  onViewFrame() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) { /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) { /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }

  ngOnDestroy() {
    this.document.removeEventListener('fullscreenchange', this.fsEventHandler);
    this.document.removeEventListener('mozfullscreenchange', this.fsEventHandler);
    this.document.removeEventListener('webkitfullscreenchange', this.fsEventHandler);
    this.document.removeEventListener('mozfullscreenchange', this.fsEventHandler);
    this.document.removeEventListener('MSFullscreenChange', this.fsEventHandler);
  }
}
