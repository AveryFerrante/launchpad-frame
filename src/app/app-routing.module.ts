import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { AuthGuard } from './services/guards/auth-guard.service';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
  { path: 'login', component: AuthenticationComponent, canActivate: [AuthGuard] },
  { path: 'create-account', component: AuthenticationComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent },
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
