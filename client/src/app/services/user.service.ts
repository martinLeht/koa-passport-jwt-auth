import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../models/IUser';
import { RegisterPost } from '../components/register/registerPost';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {


  readonly API_URL = 'http://localhost:3000/users/';

  constructor(private http: HttpClient) { }


  register(user: RegisterPost): Observable<any> {
    return this.http.post(this.API_URL, user);;
  }

  getUsers(): Observable<any> {
    return this.http.get(this.API_URL, httpOptions);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(this.API_URL + id, httpOptions);
  }
}
