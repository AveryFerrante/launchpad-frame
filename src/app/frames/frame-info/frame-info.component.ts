import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FrameUserInfoMetadata } from 'src/app/models/FrameUserInfoMetadata';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-frame-info',
  templateUrl: './frame-info.component.html',
  styleUrls: ['./frame-info.component.css']
})
export class FrameInfoComponent implements OnInit {

  private _frameUserInfo: FrameUserInfoMetadata;
  objectKeys = Object.keys;
  @Input() set frameUserInfo(val: FrameUserInfoMetadata) { this._frameUserInfo = val; }
  get frameUserInfo() { return this._frameUserInfo; }
  @Output() close = new EventEmitter();
  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
  }

  onClose() {
    this.close.emit();
  }
}
