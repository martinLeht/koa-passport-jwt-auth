import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


interface LoginResp{
  token: string
}
interface UserObj{
  id: number,
  username: string,
  email: string,
  activationToken: string,
  active: number
}
interface RegisterResp{
  success: string,
  user: object,
}
var loginSuccess = false;

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) { }

  // HTTP root
  readonly ROOT_URL = 'http://localhost:3000';
  authToken: LoginResp;

  loginUser(post: any): boolean{
    this.http.post<LoginResp>(this.ROOT_URL + '/login', post).subscribe(data =>{
      this.authToken = data;
      console.log(this.authToken.token);
       loginSuccess = true;
    },
    error => {
      console.log(error);
      loginSuccess = false;
    });
    return loginSuccess;
  }

  setUserDetails(){

  }

  getUserDetails(){

  }

  logOutUser(){

  }

  setCookie(name: string, value: string, exp: number, ){

  }

}
