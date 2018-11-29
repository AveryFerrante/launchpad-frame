import { Component, OnInit } from '@angular/core';
import { NavbarTabEnum } from '../models/enums';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  tabEnum = NavbarTabEnum;
  selectedTab = this.tabEnum.Frames;
  constructor() { }

  ngOnInit() {
  }

  onTabChange(newTab: number) {
    this.selectedTab = newTab;
  }

}
