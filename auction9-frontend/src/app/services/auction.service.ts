import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuctionService {

  constructor(private http: HttpClient) { }

  // base endpoint
  private readonly baseEndpoint = window.location.protocol + '//' + window.location.hostname + ':3000';

  // path
  private readonly activeAuctionsPath = '/auctions/';

  // fetch all active auctions from endpoint
  getActiveAuctions() {
    return this.http.get(this.baseEndpoint + this.activeAuctionsPath, {responseType: 'json'}).toPromise();
  }
}
