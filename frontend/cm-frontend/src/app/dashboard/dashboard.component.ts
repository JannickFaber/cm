import { Component, inject } from '@angular/core';
import { AuthService } from '../service/auth/auth.service';
import { BarchartComponent } from "./barchart/barchart.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BarchartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  private authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
