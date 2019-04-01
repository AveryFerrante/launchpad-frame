import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
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

  clear(): void {
    this.frames = null;
  }
}
