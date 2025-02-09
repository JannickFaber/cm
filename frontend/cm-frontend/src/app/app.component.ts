import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from './service/auth/auth.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, MatToolbarModule, CommonModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'LCA Dashboard';

  $isLoggedIn: Observable<boolean>;

  constructor(
    private authService: AuthService
  ) {
    this.$isLoggedIn = this.authService.$isLoggedIn;
  }

  logout(): void {
    this.authService.logout();
  }
}
