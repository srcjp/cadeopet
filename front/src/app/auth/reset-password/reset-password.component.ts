import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
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
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterModule,
    MatProgressSpinnerModule,
    TranslateModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  hidePassword = true;
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
    const nav = history.state;
    this.email = nav.email || '';
    this.flow = nav.flow || '';

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
    this.resetForm = this.fb.group({
      email: [
        this.email,
        [Validators.email]
      ],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onResetPassword() {
    this.loading = true;
    if (this.resetForm.invalid) {
      this.loading = false;
      return;
    }

    if (
      this.resetForm.value.password !==
      this.resetForm.value.confirmPassword
    ) {
      this.snackBar.open(
        this.translate.instant('RESET.PASSWORD_MISMATCH'),
        this.translate.instant('COMMON.CLOSE'),
        { duration: 3000 }
      );
      this.loading = false;
      return;
    }

    this.auth.resetPassword(this.resetForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.alert.success(
          this.translate.instant('RESET.SUCCESS_MESSAGE')
        );
        this.router.navigate(['/login'], {
          state: { email: this.resetForm.value.email }
        });
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
