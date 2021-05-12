import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuctionService } from '../services/auction.service';

@Component({
  selector: 'app-history-dialog',
  templateUrl: './history-dialog.component.html',
  styleUrls: ['./history-dialog.component.scss']
})
export class HistoryDialogComponent implements OnInit {

  tableData: any[];
  tableHeaders: string[];
  auctionID: number;

  constructor(private auctionService: AuctionService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any) {
      this.auctionID = this.dialogData.auctionID;
     }

  ngOnInit(): void {
    this.auctionService.getAuctionBids(this.auctionID).then((data: []) => {
      this.tableData = Array.from(data);
      this.tableHeaders = ['email', 'price', 'time'];
    });
  }
}
