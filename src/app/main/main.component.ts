import { Component, OnInit } from '@angular/core';
import { GlobalEventsService } from '../services/global/global-events.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private globalEventService: GlobalEventsService) { }

  showNavbar = false;
  ngOnInit() {
    this.globalEventService.showNavBarEmitter.subscribe((show) => {
      this.showNavbar = show;
    });
  }

}
