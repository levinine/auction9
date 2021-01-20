import { Component, OnInit } from '@angular/core';
import { AuctionService } from '../services/auction.service';

@Component({
  selector: 'app-history-dialog',
  templateUrl: './history-dialog.component.html',
  styleUrls: ['./history-dialog.component.scss']
})
export class HistoryDialogComponent implements OnInit {

  tableData: any[];
  tableHeaders: string[];

  constructor(private auctionService: AuctionService) { }

  ngOnInit(): void {
    // TODO: once bidding is enabled, pass the 'auctionID' instead of hardcoded '1'
    this.auctionService.getAuctionBids(1).then((data: []) => {
      this.tableData = Array.from(data);
      console.log(this.tableData);

      this.tableHeaders = ['name', 'price', 'time'];
    });
  }
}
