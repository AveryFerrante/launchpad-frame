import { Component, OnInit } from '@angular/core';
import { FramesService } from 'src/app/services/frames/frames.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  constructor(private frameService: FramesService) { }

  ngOnInit() {
  }

  onCreateNew() {
  }

}
