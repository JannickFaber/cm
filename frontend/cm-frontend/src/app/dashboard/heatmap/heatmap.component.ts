import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { ChoroplethController, ColorScale, ProjectionScale, GeoFeature } from 'chartjs-chart-geo';
import * as topojson from 'topojson-client';
import { FeatureCollection, Geometry } from 'geojson';
import { Topology } from 'topojson-specification';
import * as d3 from 'd3-geo';

Chart.register(...registerables, ChoroplethController, ColorScale, ProjectionScale, GeoFeature);

@Component({
  selector: 'app-heatmap',
  standalone: true,
  templateUrl: './heatmap.component.html',
  styleUrl: './heatmap.component.scss'
})
export class HeatmapComponent implements OnInit {
  @ViewChild('heatmapCanvas', { static: true }) heatmapCanvas!: ElementRef<HTMLCanvasElement>;
  worldData: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadWorldData();
  }

  loadWorldData(): void {
    this.http.get<Topology<any>>('/assets/world.geo.json').subscribe((data) => {
      const worldTopoJson = data as Topology<any>;

      const worldFeatures = topojson.feature(worldTopoJson, worldTopoJson.objects.countries) as unknown as FeatureCollection<Geometry>;

      this.worldData = worldFeatures.features;

      this.createChart();
    });
  }


  createChart(): void {
    if (!this.worldData || !this.heatmapCanvas.nativeElement) return;

    new Chart(this.heatmapCanvas.nativeElement, {
      type: 'choropleth',
      data: {
        labels: this.worldData.map((d) => d.properties.name),
        datasets: [{
          label: 'Countries',
          data: this.worldData.map((d) => ({ feature: d, value: Math.random() })),
        }]
      },
      options: {
        showOutline: true,
        showGraticule: false,
        plugins: {
          legend: {
            display: false
          },
        },
        scales: {
          projection: {
            axis: 'x',
            projection: 'equirectangular'
          }
        }
      }
    });
  }
}
