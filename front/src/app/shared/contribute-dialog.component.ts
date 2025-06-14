import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contribute-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, TranslateModule],
  templateUrl: './contribute-dialog.component.html',
  styleUrls: ['./contribute-dialog.component.scss']
})
export class ContributeDialogComponent {
  constructor(public dialogRef: MatDialogRef<ContributeDialogComponent>) {}
  close() {
    this.dialogRef.close();
  }
}
