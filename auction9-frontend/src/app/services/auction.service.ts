import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuctionService {

  constructor(private http: HttpClient) { }

  /* getActiveAuctions - returns all auctions with active state
   * Method: GET
   * Path: /auctions */
  getActiveAuctions() {
    return this.http.get(`${environment.baseUrl}/auctions`, { responseType: 'json' }).toPromise();
  }

  /* getAuctionById - returns auction with specific ID
   * Method: GET
   * Path: /auctions/${auctionId} */
  getAuctionById(auctionId) {
    return this.http.get(`${environment.baseUrl}/auctions/${auctionId}`, { responseType: 'json' }).toPromise();

    
   /* addAuction - creates new auction
   * Method: POST
   * Path: /auctions */
  addAuction(auction) {
    return this.http.post(`${environment.baseUrl}/auctions`, auction);
  }
}
