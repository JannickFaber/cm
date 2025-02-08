import { Component, inject } from '@angular/core';
import { AuthService } from '../service/auth/auth.service';
import { BarchartComponent } from "./barchart/barchart.component";
import { TableComponent } from "./table/table.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BarchartComponent, TableComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  private authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
