import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainComponent } from './main/main.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { LoginPanelComponent } from './authentication/login-panel/login-panel.component';
import { CreateAccountPanelComponent } from './authentication/create-account-panel/create-account-panel.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';

import { AuthenticationService } from './services/authentication/authentication.service';
import { UserInfoService } from './services/userinfo/user-info.service';
import { UserInfoStore } from './services/stores/userinfostore.service';

import { FramesModule } from './frames/frames.module';


import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ImageCardComponent } from './image-card/image-card.component';

@NgModule({
  declarations: [
    MainComponent,
    AuthenticationComponent,
    LoginPanelComponent,
    CreateAccountPanelComponent,
    HomeComponent,
    NavbarComponent,
    ImageCardComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    FramesModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthenticationService,
    UserInfoService,
    UserInfoStore
  ],
  bootstrap: [MainComponent]
})
export class AppModule { }
