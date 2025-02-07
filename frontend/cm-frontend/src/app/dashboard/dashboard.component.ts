import { Component, inject } from '@angular/core';
import { AuthService } from '../service/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  private authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
