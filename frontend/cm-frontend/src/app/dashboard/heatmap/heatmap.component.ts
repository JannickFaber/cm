import { Component, OnInit, ElementRef, ViewChild, Input, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { ChoroplethController, ColorScale, ProjectionScale, GeoFeature } from 'chartjs-chart-geo';
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

  private http = inject(HttpClient);

  ngOnInit(): void {
    this.chemicals = [...new Set(this.gwpValues.map(values => values.name))];
    this.selectedChemical = this.chemicals[0];

    this.gwps = ['Total', 'Biogenic Emission', 'Biogenic Reduction', 'Fossil', 'Land use'];

    this.loadWorldData();
  }

  applyFilter(): void {

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
      const total = this.gwpValues.find(value => value.country === d.properties.name)?.gwpTotal;
      data.push({ feature: d, value: total ? total : NaN })
    });

    return data;
  }


  createChart(): void {
    if (!this.worldData || !this.heatmapCanvas.nativeElement) return;

    new Chart(this.heatmapCanvas.nativeElement, {
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
