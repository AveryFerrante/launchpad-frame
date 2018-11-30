import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-frames-manager-create',
  templateUrl: './frames-manager-create.component.html',
  styleUrls: ['./frames-manager-create.component.css']
})
export class FramesManagerCreateComponent implements OnInit {

  newFrameForm = new FormGroup({
    frameName: new FormControl('', [Validators.required, Validators.minLength(2)])
  });
  constructor() { }

  ngOnInit() {
  }

}
