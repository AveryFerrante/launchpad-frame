import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { AccountRoutingModule } from './account-routing.module';
import { NotificationsComponent } from './notifications/notifications.component';
import { AccountComponent } from './account/account.component';

@NgModule({
  imports: [
    CommonModule,
    // AccountRoutingModule
  ],
  declarations: [NotificationsComponent, AccountComponent],
  exports: [NotificationsComponent, AccountComponent]
})
export class AccountModule { }
