import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }

  // HTTP root
  readonly ROOT_URL = 'http://localhost:3000';
  authToken;

  loginUser(post: any){
    try{
      return this.http.post(this.ROOT_URL + '/login', post);
    }catch(err){
      console.log(err);
    }
  }
}
