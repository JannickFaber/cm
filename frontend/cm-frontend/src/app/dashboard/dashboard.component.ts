import { Component, inject } from '@angular/core';
import { AuthService } from '../service/auth/auth.service';
import { BarchartComponent } from "./barchart/barchart.component";
import { TableComponent } from "./table/table.component";
import { HeatmapComponent } from "./heatmap/heatmap.component";
import { RadarChartComponent } from "./radar-chart/radar-chart.component";
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, BarchartComponent, TableComponent, HeatmapComponent, RadarChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  stoffe: string[] = ['Stoff A', 'Stoff B', 'Stoff C'];
  laender: string[] = ['Deutschland', 'USA', 'China'];
  prozesse: string[] = ['Herstellung', 'Transport', 'Entsorgung'];

  selectedStoff: string = '';
  selectedLand: string = '';
  selectedProzess: string = '';

  private authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }

  applyFilter(): void {
    console.log('Filter angewendet:', this.selectedStoff, this.selectedLand, this.selectedProzess);
    // Hier kannst du nun die Daten filtern und Charts neu rendern
  }
}