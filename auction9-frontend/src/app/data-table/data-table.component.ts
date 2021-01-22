import { Component, OnInit, ChangeDetectorRef, AfterViewInit, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuctionService } from '../services/auction.service';

// our data structure
export interface AuctionData {
  auctionID: number;
  title: string;
  description: number;
  date_from: string;
  date_to: string;
  price: number;
  status: string;
  created_by: number;
  winner: number;
}

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})

export class DataTableComponent implements AfterViewInit {
  // data from parent
  @Input() tableData: AuctionData[];
  // table headers from parent
  @Input() tableHeaders: string[];
  // stop method from user-auctions
  @Input() stopActiveAuction: Function;
  // confirm method from user-auctions
  @Input() realizeAuction: Function;

  dataSource: MatTableDataSource<AuctionData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private cdRef: ChangeDetectorRef) { }

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource(Array.from(this.tableData));

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.cdRef.detectChanges();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  stopActiveAuctionID(id) {
    this.stopActiveAuction(id);
  }

  realizeFinishedAuctionID(auction, status) {
    this.realizeAuction(auction, status);
  }
}
