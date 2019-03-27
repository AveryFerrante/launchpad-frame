import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { AuthGuard } from './services/guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { UnauthGuardGuard } from './services/guards/unauth.guard';

const appRoutes: Routes = [
  { path: 'login', component: AuthenticationComponent, canActivate: [AuthGuard] },
  { path: 'create-account', component: AuthenticationComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [UnauthGuardGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes, { enableTracing: false })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
