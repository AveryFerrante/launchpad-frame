import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, skipWhile } from 'rxjs/operators';
import { ClientFrame } from 'src/app/models/client-side/ClientFrame';
import { FrameImage } from 'src/app/models/FrameImage';

@Injectable({
  providedIn: 'root'
})
export class FramesStore {

  private readonly _frames = new BehaviorSubject<ClientFrame[]>(null);
  readonly frames$ = this._frames.asObservable();
  constructor() { }

  private get frames(): ClientFrame[] {
    return this._frames.getValue();
  }

  private set frames(val: ClientFrame[]) {
    this._frames.next(val);
  }

  add(val: ClientFrame) {
    if (this.frames == null) {
      this.frames = [val];
    } else {
      this.frames = [...this.frames, val];
    }
  }

  getFrameWatcher(frameId: string): Observable<ClientFrame> {
    return this.frames$.pipe(
      skipWhile((f: ClientFrame[]) => f === null),
      map((frames: ClientFrame[]) => {
        const match = frames.filter((f: ClientFrame) => f.id === frameId);
        return match.length > 0 ? match[0] : null;
      })
    );
  }

  get(frameId: string): ClientFrame {
    const match = this.frames.filter((f: ClientFrame) => f.id === frameId);
    return match.length > 0 ? match[0] : null;
  }

  exists(frameId: string) {
    if (this._frames.getValue() === null) {
      return false;
    }
    const match = this._frames.getValue().filter((f: ClientFrame) => f.id === frameId);
    return match.length > 0;
  }

  addImage(frameId: string, image: FrameImage): void {
    const oldFrame = this.get(frameId);
    if (oldFrame) {
      const frame = cloneDeep(oldFrame);
      frame.images.unshift(image);
      this.frames = this.replaceFrame(oldFrame, frame);
    } else {
      throw new Error('Can\'t find frame to update image');
    }
  }

  removeImage(frameId: string, frameImageId: string) {
    console.log('Finding frame: ', frameId);
    const oldFrame = this.get(frameId);
    if (oldFrame) {
      const frame = cloneDeep(oldFrame);
      const removeIndex = frame.images.findIndex((img: FrameImage) => img.id === frameImageId);
      frame.images.splice(removeIndex, 1);
      this.frames = this.replaceFrame(oldFrame, frame);
    } else {
      throw new Error('Can\'t find frame to update image');
    }
  }

  // addMultiple(val: ClientFrame[]) {
  //   if (this.frames == null) {
  //     this.frames = val;
  //   } else {
  //     this.frames = [...this.frames].concat(val);
  //   }
  // }

  // get(val: string): Observable<Frame> {
  //   return this.frames$.pipe(
  //     skipWhile((f: Frame[]) => f === null),
  //     map((frames: Frame[]) => {
  //       const matches = frames.filter((f: Frame) => f.id === val);
  //       if (matches.length > 0) {
  //         return matches[0];
  //       } else {
  //         return null;
  //       }
  //     })
  //   );
  // }

  // addImage(frame: Frame, imageId: string, imagePath: string) {
  //   // let imageIdArray = frame.imageIds;
  //   // let imagePathArray = frame.imagePaths;
  //   // if (imageIdArray === null) {
  //   //   imageIdArray = [imageId];
  //   // } else {
  //   //   imageIdArray = [...imageIdArray, imageId];
  //   // }
  //   // if (imagePathArray === null) {
  //   //   imagePathArray = [imagePath];
  //   // } else {
  //   //   imagePathArray = [...imagePathArray, imagePath];
  //   // }
  //   // const newFrame = new Frame(frame.id, frame.title, frame.description, frame.createdDate,
  //   //   frame.createdBy, frame.endDate, imagePathArray, imageIdArray);
  //   // this.frames = this.replaceFrame(frame, newFrame);
  // }

  // clear(): void {
  //   this.frames = null;
  // }

  private replaceFrame(oldFrame: ClientFrame, newFrame: ClientFrame): ClientFrame[] {
    const frameSnapshot = cloneDeep(this.frames);
    frameSnapshot[this.frames.indexOf(oldFrame)] = newFrame;
    return frameSnapshot;
  }
}
