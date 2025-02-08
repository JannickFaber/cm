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

      // Konvertiere TopoJSON zu GeoJSON
      const worldFeatures = topojson.feature(worldTopoJson, worldTopoJson.objects.countries) as unknown as FeatureCollection<Geometry>;

      this.worldData = worldFeatures.features; // Jetzt korrekt als GeoJSON gespeichert
      console.log(this.worldData); // Überprüfe, ob die Daten richtig geladen sind

      this.createChart();
    });
  }


  createChart(): void {
    if (!this.worldData || !this.heatmapCanvas.nativeElement) return;

    const width = this.heatmapCanvas.nativeElement.width;
    const height = this.heatmapCanvas.nativeElement.height;

    // 🟢 D3-Projektion mit fitSize
    const projection = d3.geoNaturalEarth1()
      .scale(width / 6) // Skaliert die Karte korrekt
      .translate([width / 2, height / 2]);
    const pathGenerator = d3.geoPath(projection);

    projection.fitSize([width, height], { type: 'FeatureCollection', features: this.worldData });

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
        plugins: {},
        scales: {
          xy: {
            projection // 🟢 D3-Projektion direkt an Chart.js übergeben
          }
        }
      }
    });
  }
}
