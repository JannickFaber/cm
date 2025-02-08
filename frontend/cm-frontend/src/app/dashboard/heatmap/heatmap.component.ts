import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { ChoroplethController, ColorScale, ProjectionScale, GeoFeature } from 'chartjs-chart-geo';
import * as topojson from 'topojson-client';
import { FeatureCollection, Geometry } from 'geojson';
import { Topology } from 'topojson-specification';

Chart.register(...registerables, ChoroplethController, ColorScale, ProjectionScale, GeoFeature);

@Component({
  selector: 'app-heatmap',
  standalone: true,
  template: `
    <div class="chart-container">
      <canvas #heatmapCanvas></canvas>
    </div>
  `,
  styles: [
    `
      .chart-container {
        width: 100%;
        height: 500px;
      }
    `
  ]
})
export class HeatmapComponent implements OnInit {
  @ViewChild('heatmapCanvas', { static: true }) heatmapCanvas!: ElementRef<HTMLCanvasElement>;
  worldData: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadWorldData();
  }

  loadWorldData(): void {
    this.http.get<Topology<any>>('/assets/world.geo.json').subscribe((data) => {
      const worldTopoJson = data as Topology<any>;
      
      const worldFeatures = topojson.feature(worldTopoJson, worldTopoJson.objects.countries) as unknown as FeatureCollection<Geometry>;
  
      this.worldData = worldFeatures.features; // Jetzt korrekt typisiert
      this.createChart();
    });
  }

  createChart(): void {
    if (!this.worldData || !this.heatmapCanvas.nativeElement) return;

    new Chart(this.heatmapCanvas.nativeElement, {
      type: 'choropleth',
      data: {
        labels: this.worldData.map((d: any) => d.properties.name),
        datasets: [{
          label: 'Environmental Impact by Country',
          data: this.worldData.map((d: any) => ({
            feature: d,
            value: Math.random() * 100 // Beispielwert, hier echte Werte einsetzen
          }))
        }]
      },
      options: {
        scales: {
          xy: {
            projection: 'mercator' // Korrekte Projektion für Weltkarte
          }
        }
      }
    });
  }
}
