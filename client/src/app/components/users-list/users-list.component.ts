import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';

import { UserService } from 'src/app/services/user.service';
import { IUser } from 'src/app/models/IUser';


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  users: IUser[];
  loading: boolean = false;
  error;

  displayedColumns: string[] = ['userId', 'username', 'email', 'active'];
  dataSource = this.users;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loading = true
    this.userService.getUsers().subscribe(
      data => {
        for(let user in data) {
          console.log(user);
        }
        console.log("DATA: " + data.users);
        this.users = data.users;
        this.dataSource = this.users;
        
        console.log(this.users);
        this.loading = false;
      },
      err => {
        console.log("ERROR: " + err);
        this.error = err.error.message;
        this.loading = false;
      }
    )
  }

}
