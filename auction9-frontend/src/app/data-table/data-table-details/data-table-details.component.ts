import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuctionService } from '../../services/auction.service';
import { MatDialog } from '@angular/material/dialog';
import { HistoryDialogComponent } from 'src/app/history-dialog/history-dialog.component';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Storage } from 'aws-amplify';

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

  constructor(private router: ActivatedRoute,
    private auctionService: AuctionService,
    private dialog: MatDialog,
    config: NgbCarouselConfig) {
    config.interval = 0;
    config.pauseOnHover = false;
  }


  ngOnInit(): void {
    // get auction id from url
    const auctionId = this.router.snapshot.params['id'];
    this.auctionService.getAuctionById(auctionId).then((data) => {
      // save data
      this.auction = data;
    });

    Storage.list(`${auctionId}`).then(data => {
      data.forEach(res => {
        // generate url
        this.imageUrl = `https://auction9-auction-photos.s3-eu-west-1.amazonaws.com/public/${res.key}`;
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
}
