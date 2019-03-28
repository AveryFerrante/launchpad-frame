import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Frame } from 'src/app/models/Frame';

@Injectable({
  providedIn: 'root'
})
export class FramesStore {

  private readonly _frames = new BehaviorSubject<Frame[]>(null);
  readonly frames$ = this._frames.asObservable();
  constructor() { }

  get frames(): Frame[] {
    return this._frames.getValue();
  }

  set frames(val: Frame[]) {
    this._frames.next(val);
  }

  addFrame(val: Frame) {
    if (this.frames == null) {
      this.frames = [val];
    } else {
      this.frames = [...this.frames, val];
    }
  }
}
