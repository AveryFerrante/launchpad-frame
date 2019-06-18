import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { pipe, Subject, Subscription } from 'rxjs';
import { debounceTime, filter, switchMap, takeUntil, tap, distinctUntilChanged } from 'rxjs/operators';
import { Username } from 'src/app/models/Username';
import { UserInfoService } from 'src/UserInfo/user-info.service';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit, OnDestroy {
  userSerachValue = '';
  errorMessage = '';
  userSearchSubscription: Subscription;
  userInputSubject = new Subject<string>();
  usernameList: Username[] = [];
  @Output() usernames = new EventEmitter<Username[]>(); // This is shared with the parent...not a true copy...works for my cases
  @Output() loading = new EventEmitter<boolean>();
  constructor(private userInfoService: UserInfoService) { }

  ngOnInit() {
    this.userSearchSubscription = this.userInputSubject.pipe(
      distinctUntilChanged(),
      tap(() => this.loading.emit(true)),
      this.checkEmptyValue(),
      debounceTime(500),
      this.filterValuesWithErrorMessages(),
      switchMap((val: string) => this.userInfoService.checkUsername(val).pipe(
        takeUntil(this.userInputSubject)
      )),
      tap(() => this.loading.emit(false)),
      this.checkResponseNull(),
      this.addUsername(),
      tap(() => this.userSerachValue = '')
    ).subscribe();
  }

  public onUserType() {
    this.userInputSubject.next(this.userSerachValue);
  }

  private filterValuesWithErrorMessages() {
    return pipe(
      tap((val: string) => {
        if (this.usernamesMatch(val)) {
          this.errorMessage = 'You will be added to the frame automatically';
          this.loading.emit(false);
        }
      }),
      tap((val: string) => {
        if (this.usernameInArray(val)) {
          this.errorMessage = 'User is already added';
          this.loading.emit(false);
        }
      }),
      tap((val: string) => {
        if (val.length < 2 && val.length > 0) {
          this.loading.emit(false);
          this.errorMessage = 'Please enter atleast two characters';
        }
      }),
      filter((val: string) => (val.length >= 2 && !this.usernamesMatch(val) && !this.usernameInArray(val))),
    );
  }

  private checkEmptyValue() {
    return tap((val: string) => {
      if (val.length === 0) {
        this.loading.emit(false);
        this.errorMessage = '';
      }
    });
  }

  private checkResponseNull() {
    return pipe(
      tap((val: Username) => { if (val === null) { this.errorMessage = 'No matching username'; }}),
      filter((val: Username) => val !== null)
    );
  }

  private addUsername() {
    return tap((val: Username) => {
      this.usernameList.push(val);
      this.usernames.emit(this.usernameList);
      this.errorMessage = '';
    });
  }

  private usernamesMatch(val: string): boolean {
    return val.toLowerCase().trim() === this.userInfoService.currentState.username.toLowerCase().trim();
  }

  private usernameInArray(value: string): boolean {
    const valueTrimmed = value.toLowerCase().trim();
    return this.usernameList.map((uname: Username) => uname.usernametrimmed).indexOf(valueTrimmed) !== -1;
  }

  ngOnDestroy() {
    this.userSearchSubscription.unsubscribe();
  }
}
