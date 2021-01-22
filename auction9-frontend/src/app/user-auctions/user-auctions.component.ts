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
      this.tableHeaders = ['auctionID', 'title', 'price', 'info', 'edit', 'stop', 'confirm'];
    });
  }

  // call stop service and live update table if it's success
  stopActiveAuction(auctionId) {
    if (confirm('Are you sure you want to STOP this auction?')) {
      this.auctionService.stopAuctionById(auctionId).then((data) => {
        // live refresh table
        this.tableData.forEach((element) => {
          if (element.auctionID === auctionId) {
            if (element.status === 'ACTIVE') {
              element.status = 'INACTIVE';
            }
          }
        });
      });
    }
  }

  // creator of auction will confirm that he sold item to the winner
  realizeAuction(auction, status) {
    if (confirm('Are you sure you want to REALIZE this auction?')) {
      this.auctionService.realizeAuctionById(auction, status).then((data) => {
        this.tableData.forEach((element) => {
          if (element.auctionID === auction.auctionID) {
            if (element.status === 'FINISHED') {
              element.status = 'REALIZED';
            } else {
              alert('You can only confirm auction if it is finished');
            }
          }
        });
      });
    }
  }
}
