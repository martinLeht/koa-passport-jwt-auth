import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IUser } from '../models/IUser';
import { TokenStorageService } from './token-storage.service';
import { tap } from 'rxjs/operators';


interface LoginResp{
  user: IUser,
  accessToken: string,
  refreshToken: string
}

interface TokenRefreshResp{
  accessToken: string,
  refreshToken: string
}

interface RegisterResp{
  success: string,
  user: object,
}
var loginSuccess = false;


const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) { }

  // HTTP root
  readonly ROOT_URL = 'http://localhost:3003/auth';
  authToken: LoginResp;

  get facebookAuthUrl(): String {
    return this.ROOT_URL + '/facebook';
  }

  loginUser(post: any): Observable<LoginResp> {
    return this.http.post<LoginResp>(this.ROOT_URL + '/login', {
      email: post.email,
      password: post.password
    }, httpOptions);
  }

  logoutUser() {
    this.tokenStorage.signOut();
  }

  refreshToken(): Observable<TokenRefreshResp> {
    const refreshToken = this.tokenStorage.getRefreshToken(); 
    return this.http.post<TokenRefreshResp>(this.ROOT_URL + '/refresh-token', { 
      refreshToken }, httpOptions).pipe(
        tap(res => {
         this.tokenStorage.saveToken(res.accessToken);
         this.tokenStorage.saveRefreshToken(res.refreshToken);
        })
      );;
   }
}
