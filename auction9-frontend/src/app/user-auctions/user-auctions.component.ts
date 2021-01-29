import { Component, OnInit } from '@angular/core';
import { AuctionService } from '../services/auction.service';
import * as moment from 'moment';
import { statuses, getStatus } from '../statuses/statuses';

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
    this.auctionService.getUserAuctions().then((data: any) => {
      // First we have to set status because we no longer get it from database
      data.forEach(auction => {
        auction.status = getStatus(auction.date_from, auction.date_to, auction.stopped, auction.realized);
      });
      this.tableData = Array.from(data);
      // format dates for each element
      this.tableData.forEach((auction) => {
        auction.date_from = moment(auction.date_from).format("YYYY-MM-DD HH:mm");
        auction.date_to = moment(auction.date_to).format("YYYY-MM-DD HH:mm");
      });
      this.tableHeaders = ['auctionID', 'title', 'price', 'start_date', 'end_date', 'status', 'info', 'edit', 'stop', 'confirm'];
    });
  }


  // call stop service
  stopActiveAuction(auctionId) {
    if (confirm('Are you sure you want to STOP this auction?')) {
      this.auctionService.stopAuctionById(auctionId).then(() => {

        // Update
        this.auctionService.getUserAuctions().then((data: any) => {
          data.forEach(auction => {
            auction.status = getStatus(auction.date_from, auction.date_to, auction.stopped, auction.realized);
          });
          this.tableData = Array.from(data);
        });
        this.tableData.forEach((auction) => {
          auction.date_from = moment(auction.date_from).format("YYYY-MM-DD HH:mm");
          auction.date_to = moment(auction.date_to).format("YYYY-MM-DD HH:mm");
        });
      });
    }
  }

  // Creator of auction will confirm that he sold item to the winner
  realizeAuction(auction) {
    // Auction can be realized only if it's finished
    if (getStatus(auction.date_from, auction.date_to) === statuses.finished) {
      if (confirm('Are you sure that you want to realize this auction?')) {
        this.auctionService.realizeAuctionById(auction).then(() => {
          this.tableData.forEach(element => {
            element.realized = true;

            // Update
            this.auctionService.getUserAuctions().then((data: any) => {
              data.forEach(auction => {
                auction.status = getStatus(auction.date_from, auction.date_to, auction.realized);
              });
              this.tableData = Array.from(data);
            });
            this.tableData.forEach((auction) => {
              auction.date_from = moment(auction.date_from).format("YYYY-MM-DD HH:mm");
              auction.date_to = moment(auction.date_to).format("YYYY-MM-DD HH:mm");
            });
          });
        })
      }
    }
  }
}
