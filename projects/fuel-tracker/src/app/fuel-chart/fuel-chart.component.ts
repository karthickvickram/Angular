import { Component, OnDestroy, OnInit } from '@angular/core';
import { FuelEntry } from '../Model/Fuel';
import { Subject, takeUntil } from 'rxjs';
import { FuelService } from '../services/fuelService';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-fuel-chart',
  templateUrl: './fuel-chart.component.html',
  styleUrls: ['./fuel-chart.component.css'],
  imports: [ChartModule]
})
export class FuelChartComponent implements OnInit, OnDestroy{

  fuelEntries: FuelEntry[] = [];
  private destroyed$ = new Subject<void>();
    
  constructor(private fuelService: FuelService) { }

  ngOnInit() {
    this.fuelService.fuelEntries$
    .pipe(
      takeUntil(this.destroyed$)
    )
    .subscribe({
      next: (entries) => {
        this.fuelEntries = entries;
        this.generateChartsandBars();
      },
      error: (err) => {
        this.fuelEntries = [];
      }
    });
  }

  chartOptions: any;
  combinedChartData: any;
  generateChartsandBars() {
    const labels: string[] = [];
    const mileageData: number[] = [];
    const costPerKmData: number[] = [];
  
    for (let i = 1; i < this.fuelEntries.length; i++) {
      const prev = this.fuelEntries[i - 1];
      const curr = this.fuelEntries[i];
  
      const distance = curr.odometer - prev.odometer;
      const mileage = distance / curr.liter;
      const costPerKm = curr.amount / distance;
  
      labels.push(new Date(curr.date).toLocaleDateString());
  
      mileageData.push(+mileage.toFixed(2));
      costPerKmData.push(+costPerKm.toFixed(2));
    }
  
    this.combinedChartData = {
      labels,
      datasets: [
        {
          label: 'Mileage (KM/L)',
          data: mileageData,
          yAxisID: 'y1',
          borderColor: '#42A5F5',
          backgroundColor: '#42A5F5',
          fill: false,
          tension: 0.4,
          pointStyle: 'circle',
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: 'Cost per KM (₹)',
          data: costPerKmData,
          yAxisID: 'y2',
          borderColor: '#FFA726',
          backgroundColor: '#FFA726',
          fill: false,
          tension: 0.4,
          pointStyle: 'rectRounded',
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: 'Target Mileage (60 KM/:)',
          data: new Array(labels.length).fill(60),
          borderColor: '#FF0000',
          borderDash: [5, 5],
          fill: false,
          tension: 0,
          pointRadius: 0,
          yAxisID: 'y1',
        }
      ]
    };
  
    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            usePointStyle: true,
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false
        },
        zoom: {
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            mode: null
          },
          pan: {
            enabled: false,
            mode: null
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Date'
          }
        },
        y1: {
          type: 'linear',
          position: 'left',
          title: {
            display: true,
            text: 'Mileage (km/l)'
          },
          beginAtZero: false,
          grid: {
            drawOnChartArea: true
          }
        },
        y2: {
          type: 'linear',
          position: 'right',
          title: {
            display: true,
            text: 'Cost per KM (₹)'
          },
          beginAtZero: true,
          grid: {
            drawOnChartArea: false
          }
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}
