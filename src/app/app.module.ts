import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainComponent } from './main/main.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { LoginPanelComponent } from './authentication/login-panel/login-panel.component';
import { CreateAccountPanelComponent } from './authentication/create-account-panel/create-account-panel.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';

import { AuthenticationService } from './services/authentication/authentication.service';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    MainComponent,
    AuthenticationComponent,
    LoginPanelComponent,
    CreateAccountPanelComponent,
    HomeComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [AuthenticationService],
  bootstrap: [MainComponent]
})
export class AppModule { }
