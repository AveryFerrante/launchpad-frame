import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FramesService } from 'src/app/services/frames/frames.service';
import { UserInfoService } from 'src/app/services/userinfo/user-info.service';
import { of, timer, fromEvent, BehaviorSubject, Subject, Observable, Subscription, forkJoin } from 'rxjs';
import { debounce, debounceTime, throttleTime, map, tap, distinctUntilChanged, filter, switchMap, catchError, mergeMap } from 'rxjs/operators';
import { Username } from 'src/app/models/Username';
import { Errors } from 'src/app/models/Errors';
import { Router } from '@angular/router';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';

@Component({
  selector: 'app-create-frame',
  templateUrl: './create-frame.component.html',
  styleUrls: ['./create-frame.component.css']
})
export class CreateFrameComponent implements OnInit, OnDestroy {
  newFrameForm = new FormGroup({
    titleInput: new FormControl('', { updateOn: 'submit', validators: [Validators.required, Validators.minLength(2),
      Validators.maxLength(100)] }),
    descriptionInput: new FormControl('', { updateOn: 'submit', validators: [Validators.required, Validators.minLength(2),
      Validators.maxLength(1000)] }),
    userSearchInput: new FormControl()
  });
  get titleCtrl() { return this.newFrameForm.controls.titleInput; }
  get descriptionCtrl() { return this.newFrameForm.controls.descriptionInput; }
  submitted = false;
  userSearch: Subscription;
  usernameList: Username[] = [];
  errorMessage: string = null;
  constructor(private frameService: FramesService, private userInfoService: UserInfoService,
    private router: Router, private notificationsService: NotificationsService) {
    this.userSearch = this.newFrameForm.controls.userSearchInput.valueChanges.pipe(
      debounceTime(700),
      distinctUntilChanged(),
      tap((val: string) => {
        if (val.toLowerCase().trim() === this.userInfoService.currentSnapshot.username.toLowerCase().trim()) {
          this.errorMessage = 'You will be added to the frame automatically';
        }
      }),
      filter((val: string) => val !== '' && val !== null && val.length >= 2 &&
        val.toLowerCase().trim() !== this.userInfoService.currentSnapshot.username.toLowerCase().trim()),
      switchMap((val: string) => this.userInfoService.checkUsername(val)),
      filter((username: Username) => username !== null && this.usernameList.map((u: Username) => u.userid).indexOf(username.userid) === -1)
    ).subscribe((username: Username) => this.usernameList.push(username));
  }

  ngOnInit() {
  }

  onSubmit() {
    this.submitted = true;
    if (this.newFrameForm.valid) {
      this.frameService.add(this.titleCtrl.value, this.descriptionCtrl.value).pipe(
        // NEED TO ADD LOGIC TO HANDLE NO USERS ADDED!
        mergeMap((frameId: string) => forkJoin(this.notificationsService.addNewFrameNotifications(frameId, this.titleCtrl.value,
          this.usernameList.map(u => u.userid)), of(frameId)))
      ).subscribe({
        next: (val: [void, string]) => this.router.navigate(['home', 'frames', val[1]])
      });
    }
  }

  ngOnDestroy() {
    this.userSearch.unsubscribe();
  }
}
