import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from './services/token-storage.service';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'hoods-login';
  username: string;
  isLoggedIn: boolean = false;

  constructor(
    private router: Router, 
    private tokenStorage: TokenStorageService, 
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorage.getCurrentUser();
      this.username = user.username;
    }
  }

  logout() {
    this.authService.logoutUser();
    this.router.navigate(['/login']);
  }
  


}
