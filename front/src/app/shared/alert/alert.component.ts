import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  template: `<mat-snack-bar-container>{{ message }}</mat-snack-bar-container>`
})
export class AlertComponent {
  @Input() message = '';
}
