import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TableComponent } from "./table/table.component";
import { HeatmapComponent } from "./heatmap/heatmap.component";
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '../service/api/api.service';
import { map, Subscription } from 'rxjs';
import { ChemicalProcessData, mapToChemicalProcessDataArray } from './chemical-process-data';
import { GWPValues } from './heatmap/g-w-p-values';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    TableComponent,
    HeatmapComponent,
    MatCardModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {

  isLoading = true;
  chemicalProcessData: ChemicalProcessData[] = [];
  gwpValues: GWPValues[] = [];

  private subscription = new Subscription();
  private apiService = inject(ApiService);

  ngOnInit(): void {
    this.subscription.add(this.apiService.requestData()
      .pipe(map(data => mapToChemicalProcessDataArray(data)))
      .subscribe((chemicalProcessData: ChemicalProcessData[]) => {
        this.chemicalProcessData = chemicalProcessData;
        this.gwpValues = this.reduceChemicalProcessData(chemicalProcessData);
        this.isLoading = false;
      }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  reduceChemicalProcessData(data: ChemicalProcessData[]): GWPValues[] {
    return data.map(({ name, cas, country, gwpTotal, gwpBiogenicEmissions, gwpBiogenicRemoval, gwpFossil, gwpLandUse }) => ({
      name,
      cas,
      country,
      gwpTotal,
      gwpBiogenicEmissions,
      gwpBiogenicRemoval,
      gwpFossil,
      gwpLandUse
    }));
  }
}