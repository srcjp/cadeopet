import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { PetReport, PetService } from './pet.service';

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
    @Inject(MAT_DIALOG_DATA) public data: { pets: PetReport[] },
    private service: PetService
  ) {}

  close() {
    this.dialogRef.close();
  }

  remove(p: PetReport) {
    if (!p.id) return;
    this.service.delete(p.id).subscribe(() => {
      this.data.pets = this.data.pets.filter(m => m.id !== p.id);
    });
  }
}
