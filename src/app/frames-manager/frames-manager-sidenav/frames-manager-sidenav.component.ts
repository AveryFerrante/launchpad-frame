import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FramesManagerSidenavLinkEnum } from '../../models/enums';

@Component({
  selector: 'app-frames-manager-sidenav',
  templateUrl: './frames-manager-sidenav.component.html',
  styleUrls: ['./frames-manager-sidenav.component.css']
})
export class FramesManagerSidenavComponent implements OnInit {

  linkEnum = FramesManagerSidenavLinkEnum;
  @Input() selectedLink: number;
  @Output() tab: EventEmitter<number> = new EventEmitter<number>();
  constructor() { }

  ngOnInit() {
  }

  onLinkChange(selectedLink: number) {
    this.selectedLink = selectedLink;
    this.tab.emit(this.selectedLink);
  }

}
