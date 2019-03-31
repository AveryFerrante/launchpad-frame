import { Component, OnInit } from '@angular/core';
import { FramesService } from 'src/app/services/frames/frames.service';
import { Frame } from 'src/app/models/Frame';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  public frames$: Observable<Frame[]> = null;
  constructor(private frameService: FramesService, private router: Router) { }

  ngOnInit() {
    this.frames$ = this.frameService.currentState;
  }

  onCreateNew() {
    this.router.navigate(['home', 'frames', 'create']);
  }

}
