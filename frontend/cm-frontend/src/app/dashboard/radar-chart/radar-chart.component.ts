import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-radar-chart',
  standalone: true,
  templateUrl: './radar-chart.component.html',
  styleUrl: './radar-chart.component.scss'
})
export class RadarChartComponent implements OnInit {
  @ViewChild('radarCanvas', { static: true }) radarCanvas!: ElementRef<HTMLCanvasElement>;

  constructor() {}

  ngOnInit(): void {
    this.createRadarChart();
  }

  createRadarChart(): void {
    if (!this.radarCanvas.nativeElement) return;

    new Chart(this.radarCanvas.nativeElement, {
      type: 'radar',
      data: {
        labels: ['Fossil', 'Biogenic', 'Land Use'],
        datasets: [
          {
            label: 'Stoff A',
            data: [2.5, 1.8, 3.2],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2
          },
          {
            label: 'Stoff B',
            data: [3.1, 2.3, 2.7],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            suggestedMin: 0,
            suggestedMax: 5
          }
        },
        plugins: {
          legend: {
            position: 'top'
          }
        }
      }
    });
  }
}
