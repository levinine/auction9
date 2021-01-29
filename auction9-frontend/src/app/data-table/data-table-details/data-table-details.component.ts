import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuctionService } from '../../services/auction.service';
import { MatDialog } from '@angular/material/dialog';
import { HistoryDialogComponent } from 'src/app/history-dialog/history-dialog.component';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Storage } from 'aws-amplify';
import { awsConfigure } from 'src/environments/environment';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getStatus, statuses } from 'src/app/statuses/statuses';

@Component({
  selector: 'app-data-table-details',
  templateUrl: './data-table-details.component.html',
  styleUrls: ['./data-table-details.component.scss'],
  providers: [NgbCarouselConfig]
})
export class DataTableDetailsComponent implements OnInit {
  auction: any;
  images = [];
  imageUrl: string;
  endDate: any;
  endTime: any;
  endDateTime: any;
  remainingTime: any;
  totalNumberOfBids: any;

  constructor(private router: ActivatedRoute,
    private auctionService: AuctionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    config: NgbCarouselConfig) {
    config.interval = 0;
    config.pauseOnHover = false;
  }

  ngOnInit(): void {
    // get auction id from url
    const auctionId = this.router.snapshot.params['id'];
    this.auctionService.getAuctionById(auctionId).then((data: any) => {
      // First we have to set status because we no longer get it from database
      data.forEach(auction => {
        auction.status = getStatus(auction.date_from, auction.date_to, auction.stopped, auction.realized);
      });
      // save data
      this.auction = data[0];
      this.totalNumberOfBids = data[0].numberOfBids;

      // Date formatting
      this.endDate = moment(this.auction.date_to).format("YYYY-MM-DD");
      this.endTime = moment(this.auction.date_to).format("HH:mm");
      this.endDateTime = moment(this.endDate + ' ' + this.endTime).format("YYYY-MM-DD HH:mm");

      // Calculating remaining time
      let msec = new Date(this.endDateTime).valueOf() - Date.now();
      let hh = Math.floor(msec / 1000 / 60 / 60);
      msec -= hh * 1000 * 60 * 60;
      let mm = Math.floor(msec / 1000 / 60);
      msec -= mm * 1000 * 60;
      this.remainingTime = `${hh} hours ${mm} minutes`;
    });

    Storage.list(`${auctionId}`).then(data => {
      data.forEach(res => {
        // Generate image url
        this.imageUrl = `${awsConfigure.imageUrl}${res.key}`;
        this.images.push(this.imageUrl);
      });
    });
  }

  showHistory() {
    this.dialog.open(HistoryDialogComponent, {
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

  // Need the getter for using enum in html
  get statuses(): typeof statuses {
    return statuses;
  }
}
