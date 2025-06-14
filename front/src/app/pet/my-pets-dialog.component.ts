import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { PetReport } from './pet.service';

@Component({
  selector: 'app-my-pets-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    RouterModule,
    TranslateModule
  ],
  templateUrl: './my-pets-dialog.component.html',
  styleUrls: ['./my-pets-dialog.component.scss']
})
export class MyPetsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<MyPetsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { pets: PetReport[] }
  ) {}

  close() {
    this.dialogRef.close();
  }
}
