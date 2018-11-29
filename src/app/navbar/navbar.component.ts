import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TabEnum } from '../models/tabEnum';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Output() tab: EventEmitter<number> = new EventEmitter<number>();
  tabEnum = TabEnum;
  @Input() selectedTab: number;
  constructor() { }

  ngOnInit() {
  }

  onTabClick(tab: number) {
    this.selectedTab = tab;
    this.tab.emit(this.selectedTab);
  }

}
