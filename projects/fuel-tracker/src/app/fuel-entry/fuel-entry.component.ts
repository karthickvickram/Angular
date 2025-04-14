import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FuelEntry } from '../Model/fuelEntry';
import { FuelService } from '../services/fuelService';

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
    private fuelService: FuelService
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
      console.log(this.fuelForm.value);
      const newEntry: FuelEntry = {
        date: this.fuelForm.value.date,
        odometer: this.fuelForm.value.odometer,
        amount: this.fuelForm.value.cost,
        liter: this.fuelForm.value.quantity
      }

      this.fuelService.addFuelEntry(newEntry).subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.log(err);
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
