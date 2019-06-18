import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, skipWhile } from 'rxjs/operators';
import { ClientFrame } from 'src/app/models/client-side/ClientFrame';
import { FrameImage } from 'src/app/models/FrameImage';
import { Username } from 'src/app/models/Username';
import { FrameUserInfoPendingMetadata } from 'src/app/models/FrameUserInfoPendingMetadata';

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

  updatePendingUsers(frameId: string, invitedById: string, invitedByUsername: string, usersToAdd: Username[]) {
    const frame = this.get(frameId);
    if (frame) {
      const newFrame = cloneDeep(frame);
      usersToAdd.forEach(user => {
        const pendingUser: FrameUserInfoPendingMetadata = {
          username: user.username,
          invitedById: invitedById,
          invitedByUsername: invitedByUsername,
          invitedOn: new Date()
        };
        newFrame.users.pendingUsers[user.userid] = pendingUser;
      });
      this.frames = this.replaceFrame(frame, newFrame);
    } else {
      throw new Error('Can\'t find frame to update image');
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

  alterImageCount(frameId: string, userId: string, incrementValue: number) {
    const oldFrame = this.get(frameId);
    if (oldFrame) {
      const frame = cloneDeep(oldFrame);
      frame.users.users[userId].pictureCount += incrementValue;
      this.frames = this.replaceFrame(oldFrame, frame);
    }
  }

  clearFrames() {
    this.frames = null;
  }

  private replaceFrame(oldFrame: ClientFrame, newFrame: ClientFrame): ClientFrame[] {
    const frameSnapshot = cloneDeep(this.frames);
    frameSnapshot[this.frames.indexOf(oldFrame)] = newFrame;
    return frameSnapshot;
  }
}
