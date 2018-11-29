import { Component, OnInit } from '@angular/core';
import { FramesManagerSidenavLinkEnum } from '../models/enums';

@Component({
  selector: 'app-frames-manager',
  templateUrl: './frames-manager.component.html',
  styleUrls: ['./frames-manager.component.css']
})
export class FramesManagerComponent implements OnInit {

  linkEnum = FramesManagerSidenavLinkEnum;
  selectedLink = this.linkEnum.NewFrame;
  constructor() { }

  ngOnInit() {
  }

}
