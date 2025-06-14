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

  openImage(src: string) {
    const existing = document.querySelector('.img-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'img-overlay';
    overlay.innerHTML = `
      <div class="mat-card img-card">
        <button class="close-btn material-icons">close</button>
        <img src="${src}" />
      </div>`;
    const btn = overlay.querySelector('.close-btn') as HTMLButtonElement;
    btn.addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.remove();
    });
    document.body.appendChild(overlay);
  }
}
