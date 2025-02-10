import { Component, OnInit, ElementRef, ViewChild, Input, inject, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables, TooltipItem } from 'chart.js';
import { ChoroplethController, ColorScale, ProjectionScale, GeoFeature, ChoroplethChart } from 'chartjs-chart-geo';
import * as topojson from 'topojson-client';
import { FeatureCollection, Geometry } from 'geojson';
import { Topology } from 'topojson-specification';
import { GWPValues } from './g-w-p-values';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, startWith, map } from 'rxjs';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

Chart.register(...registerables, ChoroplethController, ColorScale, ProjectionScale, GeoFeature);

@Component({
  selector: 'app-heatmap',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatAutocompleteModule, FormsModule, ReactiveFormsModule, MatInputModule, MatIconModule],
  templateUrl: './heatmap.component.html',
  styleUrl: './heatmap.component.scss'
})
export class HeatmapComponent implements OnInit, AfterViewInit {
  @ViewChild('heatmapCanvas', { static: true }) heatmapCanvas!: ElementRef<HTMLCanvasElement>;
  worldData: any[] = [];

  @Input() gwpValues: GWPValues[] = [];

  chemicalControl = new FormControl('');
  filteredChemicals: Observable<string[]> | undefined;
  selectedGWP: string = 'Total';
  chemicalNames: ChemicalName[] = [];
  chemicals: string[] = [];
  gwps: string[] = [];
  currentChart: ChoroplethChart | undefined;

  private http = inject(HttpClient);

  ngOnInit(): void {
    this.chemicals = [...new Set(this.gwpValues.map(value => value.name))];
    this.chemicalNames = this.chemicals.map(chem => ({ name: chem, cas: this.gwpValues.find(value => value.name === chem)?.cas }));
    this.chemicalControl.setValue(this.chemicals[0]);

    this.gwps = ['Total', 'Biogenic Emission', 'Biogenic Reduction', 'Fossil', 'Land use'];

    this.filteredChemicals = this.chemicalControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterChemicals(value || ''))
    );

    this.loadWorldData();
  }

  ngAfterViewInit() {
    this.resizeCanvas()
    window.addEventListener('resize', () => this.resizeCanvas()); // Listener hinzufügen
  }

  resizeCanvas() {
    const canvas = this.heatmapCanvas.nativeElement;
    canvas.width = window.innerWidth * 0.9; // 90% der Fensterbreite
    canvas.height = window.innerHeight * 0.7; // 70% der Fensterhöhe

    // Falls du mit Chart.js arbeitest, musst du den Chart neu rendern:
    if (this.currentChart) {
      this.currentChart.resize();
    }
  }

  loadWorldData(): void {
    this.http.get<Topology<any>>('/assets/world.geo.json').subscribe((data) => {
      const worldTopoJson = data as Topology<any>;

      const worldFeatures = topojson.feature(worldTopoJson, worldTopoJson.objects.countries) as unknown as FeatureCollection<Geometry>;

      this.worldData = worldFeatures.features

      this.createChart();
    });
  }

  getData(): { feature: any, value: number }[] {

    const data: { feature: any, value: number }[] = [];

    this.worldData.forEach(d => {

      let value: number | undefined;
      const gwps = this.gwpValues
        .filter(value => value.name === this.chemicalControl.value)
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
          label: '',
          data: this.getData(),
          borderColor: "grey", // Dunklere Ränder für bessere Sichtbarkeit
          borderWidth: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        showOutline: false,
        showGraticule: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (v) => this.getTooltipValue(v)
            }
          }
        },
        scales: {
          projection: {
            axis: 'x',
            projection: 'mercator'
          },
          color: {
            display: false,
            interpolate: (v) => this.getColorScale(v),
            axis: 'x',
            quantize: 5,
            legend: {
              position: 'bottom-right',
              align: 'right'
            }
          },
        }
      }
    });
  }

  getTooltipValue(value: TooltipItem<'choropleth'>): string {

    const displayValue = value.formattedValue === 'NaN' ? 'no data' : value.formattedValue;
    const countryName = (value.element as any).feature.properties.name;

    return ` ${countryName}: ${displayValue}`
  }

  getColorScale(value: number): string {

    if (value === 0) {
      return '#F3F3F3'
    }

    if (value < 0.2) {
      return '#C4CCD8'
    }

    if (value < 0.4) {
      return '#95A5BD'
    }

    if (value < 0.6) {
      return '#667EA1'
    }

    if (value < 0.8) {
      return '#375786'
    }

    return '#08306B';
  }

  private filterChemicals(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.chemicalNames
      .filter(chemical => chemical.name.toLowerCase().includes(filterValue) || chemical.cas?.toLowerCase().includes(filterValue))
      .map(chem => chem.name);
  }

  clearSearch() {
    this.chemicalControl.setValue('');
  }
}

interface ChemicalName {
  name: string;
  cas: string | undefined;
}