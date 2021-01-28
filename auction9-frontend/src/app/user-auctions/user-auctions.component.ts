import { Component, OnInit } from '@angular/core';
import { AuctionService } from '../services/auction.service';
import * as moment from 'moment';
import { timeValidator } from '../custom-validators/start-end-time-validator';

@Component({
  selector: 'app-user-auctions',
  templateUrl: './user-auctions.component.html',
  styleUrls: ['./user-auctions.component.scss']
})
export class UserAuctionsComponent implements OnInit {
  tableData: any[];
  tableHeaders: string[];
  // date formats
  startDate: any;
  startTime: any;
  startDateTime: any;
  endDate: any;
  endTime: any;
  endDateTime: any;

  constructor(private auctionService: AuctionService) { }

  ngOnInit(): void {
    this.auctionService.getUserAuctions().then((data: []) => {
      this.tableData = Array.from(data);
      // format dates for each element
      this.tableData.forEach((element) => {
        // start date
        this.startDate = moment(element.date_from).format("YYYY-MM-DD");
        this.startTime = moment(element.date_from).format("HH:mm");
        this.startDateTime = moment(this.startDate + ' ' + this.startTime).format("YYYY-MM-DD HH:mm");
        element.date_from = this.startDateTime; // final format

        // end date
        this.endDate = moment(element.date_to).format("YYYY-MM-DD");
        this.endTime = moment(element.date_to).format("HH:mm");
        this.endDateTime = moment(this.endDate + ' ' + this.endTime).format("YYYY-MM-DD HH:mm");
        element.date_to = this.endDateTime;
      });
      this.tableHeaders = ['auctionID', 'title', 'price', 'start_date', 'end_date', 'status', 'info', 'edit', 'stop', 'confirm'];
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
