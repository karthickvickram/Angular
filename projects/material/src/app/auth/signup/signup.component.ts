import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { FormsModule, NgForm } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [MaterialModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  providers: [provideNativeDateAdapter()],
  encapsulation: ViewEncapsulation.Emulated
})
export class SignupComponent implements OnInit, OnDestroy {

  constructor() {

  }

  maxDate!: Date

  ngOnInit(): void {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  onSubmit(form: NgForm) {
    console.log(form);
  }

  ngOnDestroy(): void {
    
  }
}
