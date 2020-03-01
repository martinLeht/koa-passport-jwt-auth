import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from './services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'hoods-login';
  username: string;
  isLoggedIn: boolean = false;

  constructor(private router: Router, private tokenStorage: TokenStorageService) {}

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorage.getUser();
      this.username = user.username;
    }
  }

  logout() {
    this.tokenStorage.signOut();
    localStorage.clear();
    window.location.reload();
  }
  


}
