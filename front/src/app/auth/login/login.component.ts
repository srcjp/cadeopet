import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AlertService } from '../../shared/alert.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatProgressSpinnerModule,
    TranslateModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  email: string = '';
  flow: string = '';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
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

  hidePassword = true;
  loading = false;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [this.email, [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    this.loading = true;
  
    this.authService.login(this.loginForm.value).subscribe({
      next: res => {
        this.loading = false;
        localStorage.setItem('accessToken', res.accessToken);
        this.snackBar.open("logou", 'Fechar', { duration: 3000 });
        this.router.navigate(['/pet']);
      },
      error: err => {
        this.loading = false;

      if(err.error.status == 'PENDING_VERIFICATION'){
          this.router.navigate(['/verify'], {
            state: { email: this.loginForm.value.email, flow: 'verify' }
          });
        }
      }
    });
  }
  
}
