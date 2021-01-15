import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuctionFetchService } from '../services/auction-fetch.service';

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

  displayedColumns: string[] = ['auctionID', 'title', 'price', 'action'];
  dataSource: MatTableDataSource<AuctionData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private auctionFetchService: AuctionFetchService) { }

  ngAfterViewInit() {
    this.auctionFetchService.getActiveAuctions().then((data: []) => {
      console.log(data);
      const auctions = Array.from(data);
      this.dataSource = new MatTableDataSource(auctions);
      
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
