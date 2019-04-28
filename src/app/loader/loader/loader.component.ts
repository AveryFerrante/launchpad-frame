import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  @Input() size = 'md';
  sizing: number;
  constructor() { }

  ngOnInit() {
    if (this.size.toLowerCase() === 'sm') {
      this.sizing = 1;
    } else if (this.size.toLowerCase() === 'md') {
      this.sizing = 2;
    }
  }

}
