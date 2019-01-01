import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { LoginPanelComponent } from './login/login-panel/login-panel.component';
import { CreateAccountPanelComponent } from './login/create-account-panel/create-account-panel.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    MainComponent,
    LoginComponent,
    LoginPanelComponent,
    CreateAccountPanelComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [MainComponent]
})
export class AppModule { }
