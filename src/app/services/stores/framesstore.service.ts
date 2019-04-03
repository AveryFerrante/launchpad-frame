import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Frame } from 'src/app/models/Frame';
import { map, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FramesStore {

  private readonly _frames = new BehaviorSubject<Frame[]>(null);
  readonly frames$ = this._frames.asObservable();
  constructor() { }

  private get frames(): Frame[] {
    return this._frames.getValue();
  }

  private set frames(val: Frame[]) {
    this._frames.next(val);
  }

  add(val: Frame) {
    if (this.frames == null) {
      this.frames = [val];
    } else {
      this.frames = [...this.frames, val];
    }
  }

  addMultiple(val: Frame[]) {
    if (this.frames == null) {
      this.frames = val;
    } else {
      this.frames = [...this.frames].concat(val);
    }
  }

  get(val: string): Observable<Frame> {
    return this.frames$.pipe(
      first((f: Frame[]) => f !== null),
      map((frames: Frame[]) => {
        const matches = frames.filter((f: Frame) => f.id === val);
        if (matches.length > 0) {
          return matches[0];
        } else {
          return null;
        }
      })
    );
  }

  addImage(frame: Frame, imageId: string, imagePath: string) {
    let imageIdArray = frame.imageIds;
    let imagePathArray = frame.imagePaths;
    if (imageIdArray === null) {
      imageIdArray = [imageId];
    } else {
      imageIdArray = [...imageIdArray, imageId];
    }
    if (imagePathArray === null) {
      imagePathArray = [imagePath];
    } else {
      imagePathArray = [...imagePathArray, imagePath];
    }
    const newFrame = new Frame(frame.id, frame.title, frame.description, frame.createdDate,
      frame.createdBy, frame.endDate, imagePathArray, imageIdArray);
    this.frames = this.replaceFrame(frame, newFrame);
  }

  clear(): void {
    this.frames = null;
  }

  private replaceFrame(oldFrame: Frame, newFrame: Frame): Frame[] {
    const frameSnapshot = this.frames;
    console.log(frameSnapshot);
    frameSnapshot.splice(this.frames.indexOf(oldFrame), 1).push(newFrame);
    console.log(frameSnapshot);
    return frameSnapshot;
  }
}
