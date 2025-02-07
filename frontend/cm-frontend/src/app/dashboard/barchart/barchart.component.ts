import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-barchart',
  standalone: true,
  imports: [],
  templateUrl: './barchart.component.html',
  styleUrl: './barchart.component.scss'
})
export class BarchartComponent  implements AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit() {
    new Chart(this.chartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['1,1\'-methylenedibenzene', '1,2,3-trichlorobenzene', '1,2-diaminopropane', '1,3-dichloropropene', '1,8-Diazabicyclo(5.4.0)undec-7-ene'],
        datasets: [
          {
            label: 'GWP100 (CO₂-Äquivalente)',
            data: [0.8, 0.62, 0.69, 0.33, 0.71], // Beispielwerte
            backgroundColor: ['#4BC0C0', '#FF6384', '#36A2EB', '#FFCE56', '#9966FF'],
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          title: { display: true, text: 'GWP100 (CO₂-Äquivalente) pro Stoff' }
        }
      }
    });
  }
}