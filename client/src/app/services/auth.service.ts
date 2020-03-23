import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IUser } from '../models/IUser';
import { TokenStorageService } from './token-storage.service';


interface LoginResp{
  user: IUser,
  token: string
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
}
