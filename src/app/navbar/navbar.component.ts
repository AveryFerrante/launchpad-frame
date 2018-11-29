import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NavbarTabEnum } from '../models/enums';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Output() tab: EventEmitter<number> = new EventEmitter<number>();
  tabEnum = NavbarTabEnum;
  @Input() selectedTab: number;
  constructor() { }

  ngOnInit() {
  }

  onTabClick(tab: number) {
    this.selectedTab = tab;
    this.tab.emit(this.selectedTab);
  }

}
