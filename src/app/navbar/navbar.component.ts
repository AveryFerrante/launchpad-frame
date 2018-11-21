import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  selectedTab = 0;
  constructor() { }

  ngOnInit() {
  }

  onTabClick(tab: number) {
    this.selectedTab = tab;
  }

}
