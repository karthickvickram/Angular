import { Component, OnChanges, OnDestroy, OnInit, signal, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { merge, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}
  ]
})
export class LoginComponent implements OnInit, OnChanges, OnDestroy {

  public loginForm!: FormGroup;
  private destroyed$:Subject<number> = new Subject<number>();
  public invalidEmailMsg = signal('');

  constructor() {
    
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', {validators: [Validators.required, Validators.email]}),
      password: new FormControl('', {validators: [Validators.required]})
    });
    
    const emailControl = this.loginForm.get('email');
    if (emailControl) {
      merge(emailControl.valueChanges, emailControl.statusChanges)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(() => this.updateInvalidEmail())
    }
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    
  }

  updateInvalidEmail(): void {
    const emailFC = this.loginForm.get('email');
    if (emailFC?.invalid) {
      if (emailFC.hasError('required')) {
        this.invalidEmailMsg.set('Please enter your mail');
      } else if(emailFC.hasError('email')) {
        this.invalidEmailMsg.set('Please enter a valid mail');
      } else {
        this.invalidEmailMsg.set('Please enter a valid mail');
      }
    } else {
      this.invalidEmailMsg.set('');
    }
  }

  onSubmit() {
    console.log(this.loginForm)
  }

  ngOnDestroy(): void {
    this.destroyed$.next(1);
    this.destroyed$.complete();
  }

}
