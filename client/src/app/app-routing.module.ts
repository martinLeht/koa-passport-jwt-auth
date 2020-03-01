import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileComponent }   from './components/profile/profile.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { AuthGuard } from './helpers/auth.guard';


const routes: Routes = [
  {path: 'login', loadChildren: () => import('./components/login/login.module').then(m => m.LoginModule)},
  {path: 'register', loadChildren: () => import('./components/register/register.module').then(m => m.RegisterModule)},
  {path: 'userinformation', loadChildren: () => import('./components/userinformation/userinformation.module').then(m => m.UserinformationModule), canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'users', component: UsersListComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: 'users', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
