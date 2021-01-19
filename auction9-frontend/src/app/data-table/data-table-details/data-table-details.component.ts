import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuctionService } from '../../services/auction.service';

@Component({
  selector: 'app-data-table-details',
  templateUrl: './data-table-details.component.html',
  styleUrls: ['./data-table-details.component.scss']
})
export class DataTableDetailsComponent implements OnInit {

  constructor(private router: ActivatedRoute, private auctionService: AuctionService) { }

  auction: any;

  ngOnInit(): void {
    // get auction id from url
    const auctionId = this.router.snapshot.params['id'];
    this.auctionService.getAuctionById(auctionId).then((data) => {
      // save data
      this.auction = data;
    });
  }
}
