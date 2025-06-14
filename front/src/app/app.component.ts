import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent
  ],
  template: `<app-header></app-header>
<router-outlet></router-outlet>
<app-footer></app-footer>`,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'login-crud-app';
}
