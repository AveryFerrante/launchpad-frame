import { Component, OnInit } from '@angular/core';
import { TabEnum } from '../models/tabEnum';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  tabEnum = TabEnum;
  selectedTab: number;
  constructor() { }

  ngOnInit() {
  }

  onTabChange(event: number) {
  }

}
