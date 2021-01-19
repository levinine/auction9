import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-auctions',
  template: '<app-data-table></app-data-table>',
  styleUrls: ['./user-auctions.component.scss']
})
export class UserAuctionsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
