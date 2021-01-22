import { Component, OnInit, ChangeDetectorRef, AfterViewInit, ViewChild, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AddUpdateAuctionDialogComponent } from '../add-update-auction-dialog/add-update-auction-dialog.component';

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

  dataSource: MatTableDataSource<AuctionData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private cdRef: ChangeDetectorRef,
    private dialog: MatDialog) { }

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

  onEditClick(auctionID: number) {
    this.dialog.open(AddUpdateAuctionDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {
        update: true,
        auctionID: auctionID,
        auctionData: this.dataSource.filteredData //auction
      }
    });

  stopActiveAuctionID(id) {
    this.stopActiveAuction(id);
  }
}
