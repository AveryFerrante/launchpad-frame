import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FrameUserInfoMetadata } from 'src/app/models/FrameUserInfoMetadata';
import { NotifierService } from 'angular-notifier';
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
  pendingUsers: Username[] = [];
  existingUserIds: string[] = [];
  usernamesToAdd: Username[] = [];
  userId = this.authService.currentUser.uid;
  objectKeys = Object.keys;
  @Input() set frameUserInfo(val: FrameUserInfo) { this._frameUserInfo = val; this.setUsernames(); }
  get frameUserInfo() { return this._frameUserInfo; }
  @Output() close = new EventEmitter();
  constructor(private authService: AuthenticationService, private notifierService: NotifierService) { }

  ngOnInit() {
  }

  setUsernames() {
    this.pendingUsers = [];
    for (const pendingId in this.frameUserInfo.pendingUsers) {
      this.pendingUsers.push(new Username(this.frameUserInfo.pendingUsers[pendingId].username, pendingId));
    }
    this.existingUserIds = [];
    for (const ids in this.frameUserInfo.users) {
      this.existingUserIds.push(ids);
    }
  }

  onClose() {
    this.close.emit();
  }

  onNewUsernames(usernames: Username[]) {
    const pendingUserIds = this.pendingUsers.map(u => u.userid);
    usernames.forEach(u => {
      if (pendingUserIds.includes(u.userid)) {
        usernames.splice(usernames.indexOf(u), 1);
        this.notifierService.notify('default', 'User already has pending invite.');
      } else if (this.existingUserIds.includes(u.userid)) {
        usernames.splice(usernames.indexOf(u), 1);
        this.notifierService.notify('default', 'User is already a participant.');
      }
    });
    this.usernamesToAdd = usernames;
  }

  onRemoveUsername(username: Username) {
    this.usernamesToAdd.splice(this.usernamesToAdd.indexOf(username), 1);
  }
}
