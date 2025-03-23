import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-fuel-fuel-entry',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './fuel-entry.component.html',
  styleUrl: './fuel-entry.component.scss'
})
export class FuelEntryComponent implements OnInit {

  fuelForm!: FormGroup

  constructor(private formBuilder: FormBuilder) {
    this.fuelForm = this.formBuilder.group({
      'date': ['', Validators.required],
      'odometer': ['', Validators.required],
      'cost': ['', Validators.required],
      'quantity': ['', Validators.required]
    });
  }

  ngOnInit() {

  }

  onSubmit() {
    if (this.fuelForm.valid) {
      console.log(this.fuelForm.value)
    }
  }

  onClear() {
    this.fuelForm.reset();
  }
}
