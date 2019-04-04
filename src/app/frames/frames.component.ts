import { Component, OnInit, OnDestroy } from '@angular/core';
import { FramesService } from 'src/app/services/frames/frames.service';
import { Frame } from 'src/app/models/Frame';
import { concatMap, take } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'app-frames',
  templateUrl: './frames.component.html',
  styleUrls: ['./frames.component.css']
})
export class FramesComponent implements OnInit, OnDestroy {

  constructor(private frameService: FramesService) { }

  ngOnInit() {
    this.frameService.currentState.pipe(
      concatMap((state: Frame[]) => {
        if (state == null) {
          return this.frameService.getAll();
        } else {
          return of();
        }
      }),
      take(1)
    )
    .subscribe({ error: (error) => console.log('Error onInit frames component:', error),
                 complete: () => console.log('Completed fetching frames') });
  }

  ngOnDestroy() {
    this.frameService.clear();
  }

}
