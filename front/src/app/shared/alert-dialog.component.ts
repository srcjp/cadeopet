import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface AlertDialogData {
  title?: string;
  message: string;
  type: 'success' | 'warning' | 'error';
  okLabel?: string;
}

@Component({
  selector: 'app-alert-dialog',
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent {
  title = '';
  message: string;
  okLabel = 'OK';
  type: 'success'|'warning'|'error';

  constructor(
    @Inject(MAT_DIALOG_DATA) data: AlertDialogData,
    private dialogRef: MatDialogRef<AlertDialogComponent>
  ) {
    this.title   = data.title   || this.capitalize(data.type);
    this.message = data.message;
    this.okLabel = data.okLabel || 'OK';
    this.type    = data.type;
  }

  close() {
    this.dialogRef.close();
  }

  private capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
