import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { FormsModule, NgForm } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-signup',
    imports: [MaterialModule, FormsModule, TranslateModule],
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.scss',
    providers: [
        provideNativeDateAdapter(),
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
    ],
    encapsulation: ViewEncapsulation.Emulated
})
export class SignupComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService) {

  }

  maxDate!: Date

  ngOnInit(): void {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  onSubmit(form: NgForm) {
    console.log(form);
    this.authService.registerUser(
      {
        email: form.value['email'],
        password: form.value.password
      }
    )
  }

  ngOnDestroy(): void {
    
  }
}
