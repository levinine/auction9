import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  template: '<app-data-table></app-data-table>',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  someString: string;

  ngOnInit(): void {
    this.someString = 'This is HomePage';
  }

}
