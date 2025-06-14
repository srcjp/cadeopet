import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
    HeaderComponent
  ],
  template: `<app-header></app-header>
<router-outlet></router-outlet>`,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'login-crud-app';
}
