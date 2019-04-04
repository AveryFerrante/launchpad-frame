import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  frames = false;
  pictures = false;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  click(destination: string) {
    this.router.navigate(['home', destination]);
    if (destination === 'frames') {
      this.frames = true;
      this.pictures = false;
    } else {
      this.frames = false;
      this.pictures = true;
    }
  }

}
