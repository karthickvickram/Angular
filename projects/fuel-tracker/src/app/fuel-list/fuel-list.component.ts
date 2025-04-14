import { Component } from '@angular/core';
import { FuelService } from '../services/fuelService';
import { TableModule } from 'primeng/table';
import { FuelDisplay, FuelEntry } from '../Model/Fuel';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MatDialog } from '@angular/material/dialog';
import { FuelEntryComponent } from '../fuel-entry/fuel-entry.component';

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
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.fuelservice.getFuelEntries().subscribe({
      next: (data) => {
        this.fuelLog = this.toFuelDisplay(data);
      },
      error: (error) => {
        this.fuelLog = [];
        console.error('Error fetching fuel entries:', error);
      }
    })
  }

  private toFuelDisplay(entries: FuelEntry[]) {
    
    if (!entries?.length) return [];

    const sortedEntries = entries.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    const fuelDisplay: FuelDisplay[] = [];

    // Initialize the first entry with default values
    fuelDisplay.push({
      ...sortedEntries[0],
      costPerLiter: sortedEntries[0].amount / sortedEntries[0].liter,
      costPerKm: 0,
      mileage: 0,
      distanceTraveled: 0
    });

    // Calculate the cost per liter, cost per km, mileage, and distance traveled for each entry
    // starting from the second entry
    for (let i = 1; i < sortedEntries.length; i++) {
      const currentEntry = sortedEntries[i];
      const previousEntry = sortedEntries[i - 1];

      const costPerLiter = currentEntry.amount / currentEntry.liter;
      const distanceTravelled = currentEntry.odometer - previousEntry.odometer
      const costPerKM = currentEntry.amount / distanceTravelled;
      const mileage = distanceTravelled / currentEntry.liter;

      fuelDisplay.push({
        ...currentEntry,
        costPerLiter: costPerLiter,
        costPerKm: costPerKM,
        mileage: mileage,
        distanceTraveled: distanceTravelled
      });
    }
    return fuelDisplay;
  }

  editEntry(entry: FuelEntry) {
    const dialogRef = this.dialog.open(FuelEntryComponent, {
      height: '75vh',
      width: '60vw',
      disableClose: true,
      data: entry
    })
  }
  deleteEntry(entry: FuelEntry) {
    if (entry.id)
      this.fuelservice.deleteFuelEntry(entry.id);
  }


}
