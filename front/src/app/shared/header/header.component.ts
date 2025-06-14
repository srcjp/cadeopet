import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatButtonModule, MatIconModule, TranslateModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  currentLang!: string;

  constructor(private translate: TranslateService,) {
    this.translate.addLangs(['pt','en']);

    const saved = localStorage.getItem('lang');
    if (saved && ['pt','en'].includes(saved)) {
      this.currentLang = saved;
    } else {
      const raw = this.translate.getBrowserLang() || '';
      this.currentLang = raw.match(/pt|en/) ? raw : 'pt';
    }

    this.translate.setDefaultLang('pt');
    this.translate.use(this.currentLang);
  }

  switchLang(lang: 'pt' | 'en') {
    this.currentLang = lang;
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

  get loggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  logout(){
    localStorage.removeItem('accessToken');
  }
}