import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-recovery',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    RouterModule,
    MatIcon,
    MatProgressSpinnerModule,
    TranslateModule,
    MatIconModule
  ],
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.scss']
})
export class RecoveryComponent implements OnInit {
  recoveryForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
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
    this.recoveryForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSendOtp() {
    this.loading = true;
    if (this.recoveryForm.invalid) return;
    this.auth.sendOtp(this.recoveryForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.translate.instant('SNACK.OTP_SENT'),
        this.translate.instant('SNACK.CLOSE'),
        { duration: 3000 }
        this.router.navigate(['/verify'], {
          state: { email: this.recoveryForm.value.email, flow: 'recovery' }
        });
      },
      error: err => {
        this.loading = false;
        this.snackBar.open(err.error.message, 'Fechar', { duration: 3000 })
      } 
    });
  }
}
