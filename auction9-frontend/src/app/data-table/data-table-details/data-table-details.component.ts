import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuctionService } from '../../services/auction.service';
import { MatDialog } from '@angular/material/dialog';
import { HistoryDialogComponent } from 'src/app/history-dialog/history-dialog.component';
import * as moment from 'moment';
import { timeValidator } from '../../custom-validators/start-end-time-validator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-data-table-details',
  templateUrl: './data-table-details.component.html',
  styleUrls: ['./data-table-details.component.scss']
})
export class DataTableDetailsComponent implements OnInit {
  auction: any;
  endDate: any;
  endTime: any;
  endDateTime: any;
  totalNumberOfBids: any;

  constructor(private router: ActivatedRoute, private auctionService: AuctionService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    // get auction id from url
    const auctionId = this.router.snapshot.params['id'];
    this.auctionService.getAuctionById(auctionId).then((data: any) => {
      // save data
      this.auction = data[0];
      this.totalNumberOfBids = data[0].numberOfBids;

      this.endDate = moment(this.auction.date_to).format("YYYY-MM-DD");
      this.endTime = moment(this.auction.date_to).format("HH:mm");
      this.endDateTime = moment(this.endDate + ' ' + this.endTime).format("YYYY-MM-DD HH:mm");
    });
  }

  showHistory() {
    const dialogRef = this.dialog.open(HistoryDialogComponent, {
      width: '600px',
      data: {
        auctionID: this.auction.auctionID
      }
    });
  }

  postNewBid(auction, newBid) {
    this.auctionService.createNewBid(auction, newBid).then((data: any) => {
      this.auction.price = data[0].price;
      this.totalNumberOfBids = data[0].numberOfBids;
      this.snackBar.open(`Bid created successfully for Auction ID: ${this.auction.auctionID}`, '',
      {
        duration: 2000,
        panelClass: ['light-snackbar']
      });
      (err: any) => {
        this.snackBar.open('Unable to create bid.', '',
        {
          duration: 2000,
          panelClass: ['light-snackbar']
        });
      }
    });
  }
}
