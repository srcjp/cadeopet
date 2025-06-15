import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { AlertService } from '../../shared/alert.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RegisterRequest, Gender } from '../../models/register-request.model';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    TranslateModule,
    NgxMaskDirective
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private alert: AlertService,
    private translate: TranslateService
  ) {

    this.translate.addLangs(['pt','en']);

    const savedLang = localStorage.getItem('lang');
    if (savedLang && ['pt','en'].includes(savedLang)) {
      this.translate.use(savedLang);
    } 
    else {
      const raw = this.translate.getBrowserLang() || '';
      const browserLang = raw.match(/pt|en/) ? raw : 'pt';
      this.translate.use(browserLang);
    }
  }

  loading = false;

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      gender: [Gender.MALE, Validators.required],
      password: ['', Validators.required]
    });
  }

  onRegister() {
    this.loading = true;
    if (this.registerForm.invalid) return;
    const payload: RegisterRequest = {
      firstName:   this.registerForm.value.firstName,
      lastName:    this.registerForm.value.lastName,
      email:       this.registerForm.value.email,
      phoneNumber: this.registerForm.value.phoneNumber,
      gender:      this.registerForm.value.gender as Gender,
      password:    this.registerForm.value.password
    };
    this.auth.register(this.registerForm.value).subscribe({
      next: response => {
        this.loading = false;
        this.snackBar.open(
          this.translate.instant('VERIFY.OTP_SENT'), 
          this.translate.instant('COMMON.CLOSE'),
          { duration: 3000 }
        );
        this.router.navigate(['/verify'], {
          state: { email: this.registerForm.value.email }
        });
      },
      error: err => {
        this.loading = false;
        if (err.error.status == 'ALREADY_VERIFIED') {
          this.alert.error(this.translate.instant('REGISTER.ALREADY_VERIFIED'));
          this.router.navigate(['/login']);
        } else if(err.error.status == 'PENDING_VERIFICATION'){
          this.alert.error(this.translate.instant('REGISTER.PENDING_VERIFICATION'));
          this.router.navigate(['/login'], {
            state: { email: this.registerForm.value.email }
          });
        } else {
          this.alert.warning(err.error.password);
          console.log(err)
        }

      }
    });
  }
  
}
