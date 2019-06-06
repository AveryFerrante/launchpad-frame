import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Username } from 'src/app/models/Username';
import { FrameUserInfo } from 'src/app/models/FrameUserInfo';
import { FramesService } from 'src/app/services/frames/frames.service';
import { ClientFrame } from 'src/app/models/client-side/ClientFrame';

@Component({
  selector: 'app-frame-info',
  templateUrl: './frame-info.component.html',
  styleUrls: ['./frame-info.component.css']
})
export class FrameInfoComponent implements OnInit {

  private _frame: ClientFrame;
  pendingUsers: Username[] = [];
  existingUserIds: string[] = [];
  usernamesToAdd: Username[] = [];
  userId = this.authService.currentUser.uid;
  objectKeys = Object.keys;
  @Input() set frame(val: ClientFrame) {
    this._frame = val;
    this.setUsernames();
  }
  get frame() { return this._frame; }
  @Output() close = new EventEmitter();
  constructor(private authService: AuthenticationService, private notifierService: NotifierService,
    private framesService: FramesService) { }

  ngOnInit() {
  }

  setUsernames() {
    console.log('In setUsernames in frame-info.component.ts');
    this.pendingUsers = [];
    for (const pendingId in this.frame.users.pendingUsers) {
      this.pendingUsers.push(new Username(this.frame.users.pendingUsers[pendingId].username, pendingId));
    }
    this.existingUserIds = [];
    for (const ids in this.frame.users.users) {
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

  inviteUsers() {
    const observer = {
      complete: () => {
        this.notifierService.notify('success', 'User(s) have been invited!');
        this.usernamesToAdd.splice(0, this.usernamesToAdd.length);
      }
    };
    this.framesService.inviteUsers(this.frame.id, this.frame.title, this.usernamesToAdd).subscribe(observer);
  }

  onRemoveUsername(username: Username) {
    this.usernamesToAdd.splice(this.usernamesToAdd.indexOf(username), 1);
  }
}
