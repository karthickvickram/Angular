import { Component, OnChanges, OnDestroy, OnInit, signal, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { merge, Subject, takeUntil } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule, MaterialModule, TranslateModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    providers: [
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
    ]
})
export class LoginComponent implements OnInit, OnChanges, OnDestroy {

  public loginForm!: FormGroup;
  private destroyed$:Subject<number> = new Subject<number>();
  public invalidEmailMsg = signal('');

  constructor(
    public translateService: TranslateService,
    private authService: AuthService
  ) {
    // this.translateService.use('ta');
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
        this.invalidEmailMsg.set(this.translateService.instant('correctEmail'));
      } else if(emailFC.hasError('email')) {
        this.invalidEmailMsg.set(this.translateService.instant('validEmail'));
      } else {
        this.invalidEmailMsg.set(this.translateService.instant('validEmail'));
      }
    } else {
      this.invalidEmailMsg.set('');
    }
  }

  onSubmit() {
    console.log(this.loginForm);
    this.authService.login(
      {
        email: this.loginForm.value['email'],
        password: this.loginForm.value.password
      }
    )
  }

  ngOnDestroy(): void {
    this.destroyed$.next(1);
    this.destroyed$.complete();
  }

}
