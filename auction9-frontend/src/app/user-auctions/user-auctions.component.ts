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
    this.auctionService.getUserAuctions().then((data: []) => {
      this.tableData = Array.from(data);
      this.tableHeaders = ['auctionID', 'title', 'price', 'info', 'edit', 'stop'];
    });
  }

  // call stop service and live update table if it's success
  stopActiveAuction(auctionId) {
    this.auctionService.stopAuctionById(auctionId).then((data) => {
      // live refresh table
      this.tableData.forEach((element) => {
        if (element.auctionID === auctionId) {
          element.status = 'INACTIVE';
        }
      });
    });
  }

}
