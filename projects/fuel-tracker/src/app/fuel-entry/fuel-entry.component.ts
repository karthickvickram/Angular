import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FuelEntry } from '../Model/fuelEntry';
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

  fuelForm!: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<FuelEntryComponent>,
    private fuelService: FuelService,
    private toastService: ToastService
  ) {
    this.fuelForm = this.formBuilder.group({
      'date': ['', Validators.required],
      'odometer': ['', Validators.required],
      'cost': ['', Validators.required],
      'quantity': ['', Validators.required]
    });
  }

  ngOnInit() {
    this.onClear()
  }

  onSubmit() {
    if (this.fuelForm.valid) {
      const newEntry: FuelEntry = {
        date: this.fuelForm.value.date,
        odometer: this.fuelForm.value.odometer,
        amount: this.fuelForm.value.cost,
        liter: this.fuelForm.value.quantity
      }

      this.fuelService.addFuelEntry(newEntry).subscribe({
        next: (res) => {
          console.log(res);
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

  onClear() {
    this.fuelForm.reset();
  }

  onClose() {
    this.dialogRef.close();
  }
}
