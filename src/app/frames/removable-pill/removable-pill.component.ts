import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Username } from 'src/app/models/Username';

@Component({
  selector: 'app-removable-pill',
  templateUrl: './removable-pill.component.html',
  styleUrls: ['./removable-pill.component.css']
})
export class RemovablePillComponent implements OnInit {

  displayName: string;
  @Input() username: Username;
  @Input() nameCutoff = 8;
  @Output() remove = new EventEmitter<Username>();
  constructor() { }

  ngOnInit() {
    if (this.username.username.length > this.nameCutoff) {
      this.displayName = this.username.username.substr(0, this.nameCutoff) + '...';
    } else {
      this.displayName = this.username.username;
    }
  }

  onRemove() {
    this.remove.emit(this.username);
  }

}
