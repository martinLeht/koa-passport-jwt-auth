import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';


//Material imports
import { MatMenuModule, MatTableModule } from '@angular/material/';

import { AuthService } from './services/auth.service';
import { authInterceptorProviders } from './helpers/auth.interceptor';
//import { errorInterceptorProviders } from './helpers/error.interceptor';
import { UsersListComponent } from './components/users-list/users-list.component';


@NgModule({
  declarations: [
    AppComponent,
    UsersListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatTableModule,
    HttpClientModule
  ],
  providers: [AuthService, authInterceptorProviders /*, errorInterceptorProviders*/],
  bootstrap: [AppComponent]
})
export class AppModule { }
