import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Image } from 'src/app/models/Image';

@Injectable({
  providedIn: 'root'
})
export class ImagesStore {

  private readonly _images = new BehaviorSubject<Image[]>(null);
  readonly images$ = this._images.asObservable();
  constructor() { }

  private get images() { return this._images.getValue(); }
  private set images(val: Image[]) { this._images.next(val); }

  add(val: Image) {
    if (this.images == null) {
      this.images = [val];
    } else {
      this.images = [...this.images, val];
    }
  }
}
