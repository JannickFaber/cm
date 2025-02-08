import { Component, OnInit, ElementRef, ViewChild, Input, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { ChoroplethController, ColorScale, ProjectionScale, GeoFeature, ChoroplethChart } from 'chartjs-chart-geo';
import * as topojson from 'topojson-client';
import { FeatureCollection, Geometry } from 'geojson';
import { Topology } from 'topojson-specification';
import { GWPValues } from './g-w-p-values';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

Chart.register(...registerables, ChoroplethController, ColorScale, ProjectionScale, GeoFeature);

@Component({
  selector: 'app-heatmap',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './heatmap.component.html',
  styleUrl: './heatmap.component.scss'
})
export class HeatmapComponent implements OnInit {
  @ViewChild('heatmapCanvas', { static: true }) heatmapCanvas!: ElementRef<HTMLCanvasElement>;
  worldData: any[] = [];

  @Input() gwpValues: GWPValues[] = [];

  selectedChemical: string = '';
  selectedGWP: string = 'Total';
  chemicals: string[] = [];
  gwps: string[] = [];
  currentChart: ChoroplethChart | undefined;

  private http = inject(HttpClient);

  ngOnInit(): void {
    this.chemicals = [...new Set(this.gwpValues.map(values => values.name))];
    this.selectedChemical = this.chemicals[0];

    this.gwps = ['Total', 'Biogenic Emission', 'Biogenic Reduction', 'Fossil', 'Land use'];

    this.loadWorldData();
  }

  loadWorldData(): void {
    this.http.get<Topology<any>>('/assets/world.geo.json').subscribe((data) => {
      const worldTopoJson = data as Topology<any>;

      const worldFeatures = topojson.feature(worldTopoJson, worldTopoJson.objects.countries) as unknown as FeatureCollection<Geometry>;

      this.worldData = worldFeatures.features.filter(
        (d) => d?.properties?.['name'] !== "Antarctica" && d.properties?.['iso_a2'] !== "AQ"
      );

      this.createChart();
    });
  }

  getData(): { feature: any, value: number }[] {

    const data: { feature: any, value: number }[] = [];

    this.worldData.forEach(d => {

      let value: number | undefined;
      const gwps = this.gwpValues
      .filter(value => value.name === this.selectedChemical)
      .find(value => value.country === d.properties.name);

      switch (this.selectedGWP) {
        case 'Total': value = gwps?.gwpTotal;
          break;
        case 'Biogenic Emission': value = gwps?.gwpBiogenicEmissions;
          break;
        case 'Biogenic Reduction': value = gwps?.gwpBiogenicRemoval;
          break;
        case 'Fossil': value = gwps?.gwpFossil;
          break;
        case 'Land use': value = gwps?.gwpLandUse;
      }
      data.push({ feature: d, value: value ? value : NaN })
    });

    return data;
  }


  createChart(): void {
    if (!this.worldData || !this.heatmapCanvas.nativeElement) return;

    if (this.currentChart) {
      this.currentChart.destroy();
    }

    this.currentChart = new Chart(this.heatmapCanvas.nativeElement, {
      type: 'choropleth',
      data: {
        labels: this.worldData.map((d) => d.properties.name),
        datasets: [{
          label: 'Countries',
          data: this.getData(),
        }]
      },
      options: {
        showOutline: false,
        showGraticule: false,
        plugins: {
          legend: {
            display: false
          },
        },
        scales: {
          projection: {
            axis: 'x',
            projection: 'mercator'
          }
        }
      }
    });
  }
}
