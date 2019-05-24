import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FrameUserInfoMetadata } from 'src/app/models/FrameUserInfoMetadata';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Username } from 'src/app/models/Username';
import { FrameUserInfo } from 'src/app/models/FrameUserInfo';

@Component({
  selector: 'app-frame-info',
  templateUrl: './frame-info.component.html',
  styleUrls: ['./frame-info.component.css']
})
export class FrameInfoComponent implements OnInit {

  private _frameUserInfo: FrameUserInfo;
  usernames: Username[] = [];
  usernamesToAdd: Username[] = [];
  userId = this.authService.currentUser.uid;
  objectKeys = Object.keys;
  @Input() set frameUserInfo(val: FrameUserInfo) { this._frameUserInfo = val; console.log(val); this.setUsernames(); }
  get frameUserInfo() { return this._frameUserInfo; }
  @Output() close = new EventEmitter();
  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
  }

  setUsernames() {
    this.usernames = [];
    for (const pendingId in this.frameUserInfo.pendingUsers) {
      this.usernames.push(new Username(this.frameUserInfo.pendingUsers[pendingId].username, pendingId));
    }
  }

  onClose() {
    this.close.emit();
  }

  onNewUsernames(usernames: Username[]) {
    this.usernamesToAdd = usernames;
  }

  onRemoveUsername(username: Username) {
    this.usernamesToAdd.splice(this.usernamesToAdd.indexOf(username), 1);
  }
}
