import { Component, OnInit } from '@angular/core';
import { AuctionService } from '../services/auction.service';

@Component({
  selector: 'app-user-auctions',
  templateUrl: './user-auctions.component.html',
  styleUrls: ['./user-auctions.component.scss']
})
export class UserAuctionsComponent implements OnInit {
  tableData: any[];
  tableHeaders: string[];

  constructor(private auctionService: AuctionService) { }

  ngOnInit(): void {
    this.auctionService.getMyAuctions().then((data: []) => {
      this.tableData = data;
      this.tableHeaders = ['auctionID', 'title', 'price', 'info', 'edit', 'stop'];
    });
  }

}
