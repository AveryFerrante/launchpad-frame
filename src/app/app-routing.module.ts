import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, Router } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { AuthGuard } from './services/guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { UnauthGuardGuard } from './services/guards/unauth.guard';
import { FramesComponent } from './home/frames/frames.component';
import { CreateFrameComponent } from './home/frames/create-frame/create-frame.component';

const appRoutes: Routes = [
  { path: 'login', component: AuthenticationComponent, canActivate: [AuthGuard] },
  { path: 'create-account', component: AuthenticationComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

const homeRoutes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [UnauthGuardGuard], children: [
    { path: 'frames', component:  FramesComponent, children: [
      { path: 'create', component: CreateFrameComponent }
    ] }
  ] }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes, { enableTracing: false }),
    RouterModule.forChild(homeRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
