import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { VerifyComponent } from './auth/verify/verify.component';
import { RecoveryComponent } from './auth/recovery/recovery.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { PetMapComponent } from './pet/pet-map.component';
import { PetFormComponent } from './pet/pet-form.component';
import { AuthGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'pet', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify', component: VerifyComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'recovery', component: RecoveryComponent },
  { path: 'pet', component: PetMapComponent },
  { path: 'pet/new', component: PetFormComponent, canActivate: [AuthGuard] },
  { path: 'pet/:id/edit', component: PetFormComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' }
];
