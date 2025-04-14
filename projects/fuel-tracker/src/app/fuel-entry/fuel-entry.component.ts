import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FuelEntry } from '../Model/Fuel';
import { FuelService } from '../services/fuelService';
import { ToastService } from '../services/toastService';

@Component({
  selector: 'app-fuel-fuel-entry',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    DatePickerModule,
    InputNumberModule,
    FloatLabelModule
  ],
  templateUrl: './fuel-entry.component.html',
  styleUrl: './fuel-entry.component.scss'
})
export class FuelEntryComponent implements OnInit {

  fuelForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<FuelEntryComponent>,
    private fuelService: FuelService,
    private toastService: ToastService,
    @Inject(MAT_DIALOG_DATA) public editEntry: FuelEntry | null 
  ) {
    this.fuelForm = this.formBuilder.group({
      'date': ['', Validators.required],
      'odometer': ['', Validators.required],
      'cost': ['', Validators.required],
      'quantity': ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.editEntry) {
      this.fuelForm.patchValue({
        date: new Date(this.editEntry.date),
        odometer: this.editEntry.odometer,
        cost: this.editEntry.amount,
        quantity: this.editEntry.liter
      });
    } else {
      this.onClear();
    }
  }

  onSubmit() {
    if (this.fuelForm.valid) {
      const newEntry: FuelEntry = {
        date: this.fuelForm.value.date,
        odometer: this.fuelForm.value.odometer,
        amount: this.fuelForm.value.cost,
        liter: this.fuelForm.value.quantity
      }

      if (this.editEntry?.id) {
        // Edit existing entry
        newEntry.id = this.editEntry.id;
        this.fuelService.updateFuelEntry(newEntry).subscribe({
          next: (res) => {
            console.log('Fuel Entry updated in firestore');
            this.dialogRef.close(true);
            this.toastService.show('success', 'Success', 'Fuel entry updated successfully!');
          }, 
          error: (err) => {
            console.log(err);
            this.dialogRef.close(false);
            this.toastService.show('error', 'Error', 'Failed to update fuel entry!');
          }
        })
      } else {
        // Create a new entry
        this.fuelService.addFuelEntry(newEntry).subscribe({
          next: (res) => {
            console.log('Fuel Entry saved in firestore');
            this.toastService.show('success', 'Success', 'Fuel entry added successfully!');
            this.dialogRef.close(true);
          },
          error: (err) => {
            console.log(err);
            this.toastService.show('error', 'Error', 'Failed to add fuel entry!');
            this.dialogRef.close(false);
          }
        })
      }
    }
  }

  onClear() {
    this.fuelForm.reset();
  }

  onClose() {
    this.dialogRef.close();
  }
}
