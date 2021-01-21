import { Component, OnInit } from '@angular/core';
import { AuctionService } from '../services/auction.service';

@Component({
  selector: 'app-won-auctions',
  templateUrl: './won-auctions.component.html',
  styleUrls: ['./won-auctions.component.scss']
})
export class WonAuctionsComponent implements OnInit {
  tableData: any[];
  tableHeaders: string[];

  constructor(private auctionService: AuctionService) { }

  ngOnInit(): void {
    this.auctionService.getMyWonAuctions().then((data: []) => {
      this.tableData = Array.from(data);
      this.tableHeaders = ['auctionID', 'title', 'price', 'info'];
    });
  }

}
