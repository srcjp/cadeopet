import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent, AlertDialogData } from './alert-dialog.component';

@Injectable({ providedIn: 'root' })
export class AlertService {
  constructor(private dialog: MatDialog) {}

  private open(data: AlertDialogData) {
    return this.dialog.open(AlertDialogComponent, {
      width: '320px',
      data,
      panelClass: `alert-dialog-${data.type}`
    });
  }

  success(message: string, title?: string) {
    return this.open({ type: 'success', message, title });
  }

  warning(message: string, title?: string) {
    return this.open({ type: 'warning', message, title });
  }

  error(message: string, title?: string) {
    return this.open({ type: 'error', message, title });
  }
}
