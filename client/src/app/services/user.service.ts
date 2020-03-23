import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../models/IUser';
import { RegisterPost } from '../components/register/registerPost';
import { IUserDetails } from '../models/IUserDetails';


interface UpdatePost {
  username?: string,
  email?: string
}

interface UpdateResp {
  user: IUser,
  success: string
}

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly API_URL = 'http://localhost:3003/users/';

  constructor(private http: HttpClient) { }


  register(user: RegisterPost): Observable<any> {
    return this.http.post(this.API_URL, user);
  }

  getUsers(): Observable<any> {
    return this.http.get(this.API_URL, httpOptions);
  }

  getUserById(id: number): Observable<IUser> {
    return this.http.get<IUser>(this.API_URL + id, httpOptions);
  }

  getUserByIdWithDetails(id: number): Observable<IUser> {
    return this.http.get<IUser>(this.API_URL + id + '/all', httpOptions);
  }

  getUserDetailsById(id: number): Observable<any> {
    return this.http.get(this.API_URL + id +'/details', httpOptions);
  }

  updateUser(id: number, userData: UpdatePost): Observable<UpdateResp> {
    return this.http.put<UpdateResp>(this.API_URL + id, userData, httpOptions);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(this.API_URL + id, httpOptions);
  }
}
