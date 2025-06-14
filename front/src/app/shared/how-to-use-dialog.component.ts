import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-how-to-use-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, TranslateModule],
  templateUrl: './how-to-use-dialog.component.html',
  styleUrls: ['./how-to-use-dialog.component.scss']
})
export class HowToUseDialogComponent {
  constructor(public dialogRef: MatDialogRef<HowToUseDialogComponent>) {}
  close() { this.dialogRef.close(); }
}
