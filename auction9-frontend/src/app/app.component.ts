import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  static isLoggedIn : boolean;

  constructor() {
    AppComponent.isLoggedIn = false;
  }
}
