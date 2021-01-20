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
   * Path: /auctions 
   */
  getActiveAuctions() {
    return this.http.get(`${environment.baseUrl}/auctions`, { responseType: 'json' }).toPromise();
  }

  /* getAuctionById - returns auction with specific ID
   * Method: GET
   * Path: /auctions/${auctionId} 
   */
  getAuctionById(auctionId) {
    return this.http.get(`${environment.baseUrl}/auctions/${auctionId}`, { responseType: 'json' }).toPromise();
  }
  
  /* addAuction - creates new auction
   * Method: POST
   * Path: /auctions 
   */
  addAuction(auction) {
    return this.http.post(`${environment.baseUrl}/auctions`, auction);
  }

  /* getAuctionBids - returns auction bids (users' bids history)
   * Method: GET
   * Path: /auctionBids/${auctionID} */
  getAuctionBids(auctionID) {
    return this.http.get(`${environment.baseUrl}/auctionBids/${auctionID}`, { responseType: 'json' }).toPromise();

    /* getMyAuctions - return all auctions for current user
   * Method: GET
   * Path: /myauctions 
   */
   // currently userId hard coded for testing purpose
   // after SSO is implemented, this will be updated
  getMyAuctions() {
    return this.http.get(`${environment.baseUrl}/myauctions`, 
      { 
        responseType: 'json',
        // currently hard coded user ID
        params: { created_by: '2' },
      }).toPromise();
  }
}
