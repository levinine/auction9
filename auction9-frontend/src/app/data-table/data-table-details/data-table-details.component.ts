import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuctionService } from '../../services/auction.service';
import { MatDialog } from '@angular/material/dialog';
import { HistoryDialogComponent } from 'src/app/history-dialog/history-dialog.component';
import * as moment from 'moment';
import { timeValidator } from '../../custom-validators/start-end-time-validator';

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

  constructor(private router: ActivatedRoute, private auctionService: AuctionService, private dialog: MatDialog) { }

  ngOnInit(): void {
    // get auction id from url
    const auctionId = this.router.snapshot.params['id'];
    this.auctionService.getAuctionById(auctionId).then((data) => {
      // save data
      this.auction = data;

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

}
