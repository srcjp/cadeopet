import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AlertService } from '../../shared/alert.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    RouterModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslateModule
  ],
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  verifyForm!: FormGroup;
  email = '';
  flow = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private alert: AlertService,
    private translate: TranslateService
  ) {

    const navigation = history.state;
    this.email = navigation.email || '';
    this.flow = navigation.flow || '';

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

  ngOnInit(): void {
    this.verifyForm = this.fb.group({
      email: [this.email],
      otp: ['', Validators.required],
    });

    this.alert.success(
      this.translate.instant('VERIFY.OTP_SENT', { email: this.email })
    );
  }

  onVerify() {
    if (this.verifyForm.invalid) {
      return;
    }
    this.loading = true;

    this.auth.verify(this.verifyForm.value).subscribe({
      next: () => {
        this.loading = false;

        if (this.flow === 'recovery') {
          this.snackBar.open(
            this.translate.instant('VERIFY.PLEASE_RESET'),
            this.translate.instant('COMMON.CLOSE'),
            { duration: 3000 }
          );
          this.router.navigate(['/reset-password'], {
            state: { email: this.email, flow: 'recovery' }
          });
        } else {
          this.alert.success(
            this.translate.instant('VERIFY.SUCCESS')
          );
          this.router.navigate(['/login'], {
            state: { email: this.verifyForm.value.email }
          });
        }
      },
      error: err => {
        this.loading = false;
        this.snackBar.open(
          err.error.message,
          this.translate.instant('COMMON.CLOSE'),
          { duration: 3000 }
        );
      }
    });
  }
}
