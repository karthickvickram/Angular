import { Component } from '@angular/core';
import { FuelService } from '../services/fuelService';
import { TableModule } from 'primeng/table';
import { FuelDisplay, FuelEntry } from '../Model/Fuel';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fuel-fuel-list',
  imports: [
    TableModule,
    CommonModule,
    ButtonModule
  ],
  templateUrl: './fuel-list.component.html',
  styleUrl: './fuel-list.component.scss'
})
export class FuelListComponent {

  fuelLog: FuelEntry[] = [];

  constructor(
    private fuelservice: FuelService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.fuelservice.fuelEntries$.subscribe({
      next: (entries) => {
        // console.log('Fuel entries:', entries);
        this.fuelLog = this.toFuelDisplay(entries);
      },
      error: (err) => {
        this.fuelLog = [];
        console.error('Error fetching fuel entries:', err);
      }
    })
  }

  private toFuelDisplay(entries: FuelEntry[]) {
    
    if (!entries?.length) return [];

    const fuelDisplay: FuelDisplay[] = [];

    // Initialize the first entry with default values
    fuelDisplay.push({
      ...entries[0],
      costPerLiter: entries[0].amount / entries[0].liter,
      costPerKm: 0,
      mileage: 0,
      distanceTraveled: 0
    });

    // Calculate the cost per liter, cost per km, mileage, and distance traveled for each entry
    // starting from the second entry
    for (let i = 1; i < entries.length; i++) {
      const currentEntry = entries[i];
      const previousEntry = entries[i - 1];

      fuelDisplay.push({
        ...currentEntry,
        costPerLiter: this.fuelservice.calculateCostPerLiter(currentEntry),
        costPerKm: this.fuelservice.calculateCostPerKm(currentEntry, previousEntry),
        mileage: this.fuelservice.calculateMileage(currentEntry, previousEntry),
        distanceTraveled: this.fuelservice.calculateDistance(currentEntry, previousEntry)
      });
    }
    return fuelDisplay.reverse();
  }

  editEntry(entry: FuelEntry) {
    if (entry.id) {
      this.router.navigate(['entry'], { queryParams: { mode: 'edit', id: entry.id}});
    }
  }
  
  deleteEntry(entry: FuelEntry) {
    if (entry.id) {
      this.fuelservice.deleteFuelEntry(entry.id);
    }
  }

}
