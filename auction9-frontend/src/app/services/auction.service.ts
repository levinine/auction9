import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AppComponent } from '../app.component';

@Injectable({
  providedIn: 'root'
})
export class AuctionService {

  constructor(private http: HttpClient) { }

  // For routes that can be accessed without signing in
  noAuthHeader = new HttpHeaders({ 'NoAuth': 'True' });


  /* getActiveAuctions - returns all auctions with active state
   * Method: GET
   * Path: /auctions */
  getActiveAuctions() {
    return this.http.get(`${environment.baseUrl}/auctions`, { responseType: 'json', headers: this.noAuthHeader }).toPromise();
  }

  /* getAuctionById - returns auction with specific ID
   * Method: GET
   * Path: /auctions/${auctionId} */
  getAuctionById(auctionId) {
    return this.http.get(`${environment.baseUrl}/auctions/${auctionId}`, { responseType: 'json' }).toPromise();
  }

  /* addAuction - creates new auction
   * Method: POST
   * Path: /auctions */
  addAuction(auction) {
    return this.http.post(`${environment.baseUrl}/auctions`, auction).toPromise();
  }

  /* getAuctionBids - returns auction bids (users' bids history)
   * Method: GET
   * Path: auctions/{id}/bids */
  getAuctionBids(auctionID) {
    return this.http.get(`${environment.baseUrl}/auctions/${auctionID}/bids`, { responseType: 'json' }).toPromise();
  }

   /* getUserAuctions - returns auctions user has created
   * Method: GET
   * Path: /userAuctions */
   // currently userId hard coded for testing purpose
   // after SSO is implemented, this will be updated
   getUserAuctions() {
    return this.http.get(`${environment.baseUrl}/userAuctions`,
      {
        responseType: 'json',
        params: { created_by: AppComponent.loggedUser },
      }).toPromise();
  }

  /* updateArticle - updates an auction
   * Method: PUT
   * Path: /updateAuctions
   */
  updateAuction(auction) {
    return this.http.put(`${environment.baseUrl}/updateAuction`, auction).toPromise();
  }

   /* stopAuctionById - update status to inactive
   * Method: PUT
   * Path: /myauctions/id/stop  */
   stopAuctionById(auctionId) {
     return this.http.put(`${environment.baseUrl}/myauctions/${auctionId}/stop`, null).toPromise();
   }

   /* getMyWonAuctions - return all my won auctions for current user
   * Method: GET
   * Path: /wonauctions */
   // currently userId hard coded for testing purpose
   // after SSO is implemented, this will be updated
   getMyWonAuctions() {
     return this.http.get(`${environment.baseUrl}/wonauctions`,
     {
       responseType: 'json',
       params: { email: AppComponent.loggedUser },
     }).toPromise();
   }

   /* realizeAuctionById - set field 'realized' to true
   * Method: PUT
   * Path: /myauctions/id
   */
   realizeAuctionById(auction) {
     return this.http.put(`${environment.baseUrl}/myauctions/${auction.auctionID}`, { auction }).toPromise();
   }

  /* postNewBid - create new bid for selected auction
   * Method: POST
   * Path: /auctions/id/bids
   */
   createNewBid(auction, newBid) {
     return this.http.post(`${environment.baseUrl}/auctions/${auction.auctionID}/bids`,
       {
         newBid: newBid,
         email: AppComponent.loggedUser
       }).toPromise();
   }

   /* getTotalNumberOfBids - return total number of bids for selected auction
   * Method: GET
   * Path: /auctions/id/bidsnumber
   */
   getTotalNumberOfBids(auctionId) {
     return this.http.get(`${environment.baseUrl}/auctions/${auctionId}/bidsnumber`, { responseType: 'json' }).toPromise();
   }
}
