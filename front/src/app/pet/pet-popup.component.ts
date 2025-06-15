import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PetReport } from './pet.service';

@Component({
  selector: 'app-pet-popup',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './pet-popup.component.html',
  styleUrls: ['./pet-popup.component.scss']
})
export class PetPopupComponent {
  @Input() pet!: PetReport;

  phoneDigits(phone: string): string {
    return phone.replace(/\D/g, '');
  }
}
