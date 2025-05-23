import { Component, OnDestroy, OnInit } from '@angular/core';
import { FuelService } from '../services/fuelService';
import { Subject, takeUntil } from 'rxjs';
import { FuelEntry } from '../Model/Fuel';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-fuel-metrics',
  templateUrl: './fuel-metrics.component.html',
  styleUrls: ['./fuel-metrics.component.scss'],
  imports: [CommonModule, CardModule, MatIconModule],
})
export class FuelMetricsComponent implements OnInit, OnDestroy {
  
  private fuelEntries: FuelEntry[] = [];
  private destroyed$ = new Subject<void>();

  public totalEntries = 0;
  public totalDistance = 0;
  public totalFuel = 0;
  public totalCost = 0;
  public mileage = 0;
  public fuelEconomy = 0;

  public filterMonth: Date = new Date();
  public monthAmt: number = 0;
  public filterYear: Date = new Date();
  public yearAmt: number = 0;
  
  constructor(private fuelService: FuelService) {}

  ngOnInit() {
    this.fuelService.fuelEntries$
    .pipe(
      takeUntil(this.destroyed$)
    )
    .subscribe({
      next: (entries) => {
        this.fuelEntries = entries;
        this.getMetrics();
        this.getAmtByMonth();
        this.getAmtByYear();
      },
      error: (err) => {
        this.fuelEntries = [];
        this.getMetrics();
      }
    });
  }

  getMetrics() {
    this.totalEntries = this.fuelEntries.length;
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

  onMonthNavigation(dir: 'prev' | 'next') {
    const newDate = new Date(this.filterMonth);
    newDate.setMonth(newDate.getMonth() + (dir == 'prev' ? -1 : 1));
    this.filterMonth = newDate;
    this.getAmtByMonth();
  }

  onYearNavigation(dir: 'prev' | 'next') {
    const newDate = new Date(this.filterYear);
    newDate.setFullYear(newDate.getFullYear() + (dir == 'prev' ? -1 : 1));
    this.filterYear = newDate;
    this.getAmtByYear();
  }

  getAmtByMonth() {
    this.monthAmt = this.fuelEntries.reduce((sum, entry) => {
      let date = new Date(entry.date);
      if (date.getMonth() == this.filterMonth.getMonth() && date.getFullYear() == this.filterMonth.getFullYear()) {
        sum += entry.amount;
      }
      return sum;
    }, 0)
  }

  getAmtByYear() {
    this.yearAmt = this.fuelEntries.reduce((sum, entry) => {
      let date = new Date(entry.date);
      if (date.getFullYear() == this.filterYear.getFullYear()) {
        sum += entry.amount;
      }
      return sum;
    }, 0)
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}
