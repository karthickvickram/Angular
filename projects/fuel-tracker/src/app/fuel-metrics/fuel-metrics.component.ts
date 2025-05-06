import { Component, OnDestroy, OnInit } from '@angular/core';
import { FuelService } from '../services/fuelService';
import { Subject, takeUntil } from 'rxjs';
import { FuelEntry } from '../Model/Fuel';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-fuel-metrics',
  templateUrl: './fuel-metrics.component.html',
  styleUrls: ['./fuel-metrics.component.scss'],
  imports: [CommonModule, CardModule]
})
export class FuelMetricsComponent implements OnInit, OnDestroy {
  
  fuelEntries: FuelEntry[] = [];
  private destroyed$ = new Subject<void>();

  totalDistance = 0;
  totalFuel = 0;
  totalCost = 0;
  mileage = 0;
  fuelEconomy = 0;
  
  constructor(private fuelService: FuelService) { }

  ngOnInit() {
    this.fuelService.fuelEntries$
    .pipe(
      takeUntil(this.destroyed$)
    )
    .subscribe({
      next: (entries) => {
        this.fuelEntries = entries;
        this.getMetrics();
      },
      error: (err) => {
        this.fuelEntries = [];
        this.getMetrics();
      }
    });
  }

  getMetrics() {
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

  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}
