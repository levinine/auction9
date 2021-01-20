import { Component, OnInit } from '@angular/core';
import { AuctionService } from '../services/auction.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // array of all active auctions to be sent to data-table component
  tableData: any[];
  tableHeaders: string[];

  constructor(private auctionService: AuctionService) { }

  ngOnInit(): void {
    this.auctionService.getActiveAuctions().then((data: []) => {
     this.tableData = Array.from(data);
     this.tableHeaders = ['auctionID', 'title', 'price', 'info'];
   });
  }

}
