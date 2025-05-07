import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FuelEntry } from '../Model/Fuel';
import { FuelService } from '../services/fuelService';
import { ToastService } from '../services/toastService';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { sideMenuId } from '../Model/menuList';

@Component({
  selector: 'app-fuel-fuel-entry',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    DatePickerModule,
    InputNumberModule,
    FloatLabelModule,
    CommonModule
  ],
  templateUrl: './fuel-entry.component.html',
  styleUrl: './fuel-entry.component.scss'
})
export class FuelEntryComponent implements OnInit, OnDestroy {

  fuelForm!: FormGroup;
  mode: 'create' | 'edit' | null = null;
  fuelEntries: FuelEntry[] = [];
  editIndex: number = -1;
  lastIndex: number = -1;

  private destroyed$ = new Subject<void>();
  
  constructor(
    private formBuilder: FormBuilder,
    private fuelService: FuelService,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.fuelForm = this.formBuilder.group({
      'date': ['', Validators.required],
      'odometer': ['', Validators.required],
      'cost': ['', Validators.required],
      'quantity': ['', Validators.required]
    });
  }

  ngOnInit() {
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

    this.activatedRoute.queryParams
    .pipe(
      takeUntil(this.destroyed$)
    ).subscribe((params) => {
      this.mode = params['mode'];
      if (this.mode == 'edit') {
        this.fuelService.updateNavigationUI(sideMenuId.entry);
        let index = this.fuelEntries.findIndex(entry => entry.id == params['id']);
        if (index == -1) {
          this.toastService.show('error', 'Error', 'Fuel entry not found!');
          this.onClear();
          return;
        }
        this.editIndex = index;
        this.lastIndex = index - 1;
        if (this.fuelEntries[this.editIndex]) {
          this.fuelForm.patchValue({
            date: new Date(this.fuelEntries[this.editIndex].date),
            odometer: this.fuelEntries[this.editIndex].odometer,
            cost: this.fuelEntries[this.editIndex].amount,
            quantity: this.fuelEntries[this.editIndex].liter
          });
        }
      } else {
        //Create Mode
        this.onClear();
        this.editIndex = -1;
        this.lastIndex = this.fuelEntries.length - 1;
      }
    });
  }

  onSubmit() {
    if (this.fuelForm.valid) {
      const newEntry: FuelEntry = {
        date: this.fuelForm.value.date,
        odometer: this.fuelForm.value.odometer,
        amount: this.fuelForm.value.cost,
        liter: this.fuelForm.value.quantity
      }

      if (this.mode == 'edit') {
        if (this.fuelEntries[this.editIndex]?.id) {
          newEntry.id = this.fuelEntries[this.editIndex].id;
          this.onClear();
          this.fuelService.updateFuelEntry(newEntry).subscribe({
            next: (res) => {
              console.log('Fuel Entry updated in firestore');
              this.toastService.show('success', 'Success', 'Fuel entry updated successfully!');
              this.editIndex = -1;
              this.lastIndex = this.fuelEntries.length - 1;
            }, 
            error: (err) => {
              console.log(err);
              this.toastService.show('error', 'Error', 'Failed to update fuel entry!');
            }
          })
        }
      } else {
        // Create a new entry
        this.onClear();
        console.log(this.fuelEntries)
        this.fuelService.addFuelEntry(newEntry).subscribe({
          next: (res) => {
            console.log('Fuel Entry saved in firestore');
            this.toastService.show('success', 'Success', 'Fuel entry added successfully!');
            this.editIndex = -1;
            this.lastIndex = this.fuelEntries.length - 1;
          },
          error: (err) => {
            console.log(err);
            this.toastService.show('error', 'Error', 'Failed to add fuel entry!');
          }
        })
      }
    }
  }

  onClear() {
    this.fuelForm.reset();
  }

  getDistance(journey: 'last' | 'current') {
    let first, second;
    if (journey == 'last') {
      first = this.fuelEntries[this.lastIndex];
      second = this.fuelEntries[this.lastIndex - 1];
    } else if (journey == 'current') {
      first = this.createFuelEntry();
      second = this.fuelEntries[this.lastIndex];
    }
    if (!first || !second) {
      return journey == 'last' ? -1 : -2;
    }
    let distance = this.fuelService.calculateDistance(first, second);
    return distance;
  }

  getMileage(journey: 'last' | 'current') {
    let first, second;
    if (journey == 'last') {
      first = this.fuelEntries[this.lastIndex];
      second = this.fuelEntries[this.lastIndex - 1];
    } else if (journey == 'current') {
      first = this.createFuelEntry();
      second = this.fuelEntries[this.lastIndex];
    }
    if (!first || !second) {
      return journey == 'last' ? -3 : -4;
    }
    let mileage = this.fuelService.calculateMileage(first, second);
    return mileage
  }

  getOverAllMileage(journey: 'last' | 'current') {
    if (this.mode == 'edit' && journey == 'current' && this.fuelEntries[this.editIndex]?.id) {
      let id = this.fuelEntries[this.editIndex].id;
      return this.fuelService.calculateOverallMileage(this.fuelEntries.filter(x => x.id != id).concat(this.createFuelEntry()));
    }
    if (journey == 'current') {
      return this.fuelService.calculateOverallMileage(this.fuelEntries.concat(this.createFuelEntry()));
    } else {
      return this.fuelService.calculateOverallMileage(this.fuelEntries);
    }
  }

  createFuelEntry() {
    const newEntry: FuelEntry = {
      date: this.fuelForm.value.date || null,
      odometer: this.fuelForm.value.odometer || null,
      amount: this.fuelForm.value.cost || null,
      liter: this.fuelForm.value.quantity || null
    }
    return newEntry;
  }

  getPercentChange(type: 'distance' | 'overAllMileage') {
    let initial = type == 'distance' ? this.getDistance('last') : this.getOverAllMileage('last');
    let final = type == 'distance' ? this.getDistance('current') : this.getOverAllMileage('current');

    if (initial == 0) {
      return -1
    }
    if (type == 'distance') {
      return (((final - initial) / initial) * 100).toFixed(1);
    } else {
      return (((final - initial) / initial) * 100).toFixed(2);
    }
  }

  getTrendDirection(type: 'distance' | 'overAllMileage'): 'increase' | 'decrease' | 'nuetral' {
    const percent = Number(this.getPercentChange(type));
    if (percent > 0) return 'increase'
    if (percent < 0) return 'decrease'
    return 'nuetral'
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.editIndex = -1;
    this.lastIndex = -1;
  }
}
