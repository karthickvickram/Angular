import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { FuelService } from '../services/fuelService';

@Component({
  selector: 'app-fuel-fuel-dashboard',
  imports: [CommonModule, CardModule],
  templateUrl: './fuel-dashboard.component.html',
  styleUrl: './fuel-dashboard.component.scss'
})
export class FuelDashboardComponent {
  totalEntries = 0;
  totalDistance = 0;
  totalFuel = 0;
  totalCost = 0;
  mileage = 0;
  fuelEconomy = 0;
  fuelConsumption = 0;

  constructor(private fuelService: FuelService) {}

  ngOnInit(): void {
    this.fuelService.getFuelEntries().subscribe(entries => {
      const sorted = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      this.totalEntries = entries.length;
      this.totalFuel = entries.reduce((sum, e) => sum + e.liter, 0);
      this.totalCost = entries.reduce((sum, e) => sum + e.amount, 0);

      this.totalDistance = 0;

      for (let i = 1; i < sorted.length; i++) {
        const traveled = sorted[i].odometer - sorted[i - 1].odometer;
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

    });
  }
}
