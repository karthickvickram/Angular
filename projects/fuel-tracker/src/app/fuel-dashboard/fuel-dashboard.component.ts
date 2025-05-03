import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { FuelService } from '../services/fuelService';
import { FuelEntry } from '../Model/Fuel';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-fuel-fuel-dashboard',
  imports: [CommonModule, CardModule, ChartModule],
  templateUrl: './fuel-dashboard.component.html',
  styleUrl: './fuel-dashboard.component.scss'
})
export class FuelDashboardComponent implements OnInit, OnDestroy {

  fuelEntries: FuelEntry[] = [];
    private destroyed$ = new Subject<void>();
  

  totalDistance = 0;
  totalFuel = 0;
  totalCost = 0;
  mileage = 0;
  fuelEconomy = 0;
  fuelConsumption = 0;

  constructor(
    private fuelService: FuelService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngOnInit() {
    this.fuelService.fuelEntries$
    .pipe(
      takeUntil(this.destroyed$)
    )
    .subscribe({
      next: (entries) => {
        this.fuelEntries = entries;
      },
      error: (err) => {
        this.fuelEntries = [];
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      const { Chart } = await import('chart.js');
      const zoomPlugin = (await import('chartjs-plugin-zoom')).default;
      Chart.register(zoomPlugin);
    }
  
    this.getDashboardData();
  }

  getDashboardData() {
    this.totalFuel = this.fuelEntries.reduce((sum, e) => sum + e.liter, 0);
    this.totalCost = this.fuelEntries.reduce((sum, e) => sum + e.amount, 0);

    this.totalDistance = 0;

    for (let i = 1; i < this.fuelEntries.length; i++) {
      const traveled = this.fuelEntries[i].odometer - this.fuelEntries[i - 1].odometer;
      this.totalDistance += traveled;
    }

    this.mileage = this.totalDistance && this.totalFuel
      ? this.totalDistance / this.totalFuel
      : 0;

    this.fuelEconomy = this.totalDistance && this.totalCost
      ? this.totalCost / this.totalDistance
      : 0;

    this.fuelConsumption = this.totalDistance && this.totalFuel
      ? this.totalFuel / this.totalDistance
      : 0;

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
            mode: 'x'
          },
          pan: {
            enabled: true,
            mode: 'x'
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
          beginAtZero: true,
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
    };
  }
  
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
