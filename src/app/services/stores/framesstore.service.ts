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

  clear(): void {
    this.frames = null;
  }
}
