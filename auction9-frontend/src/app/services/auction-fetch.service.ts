import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuctionFetchService {

  constructor(private http: HttpClient) { }

  // endpoints
  private readonly allActiveAuctionsEndpoint = 'http://127.0.0.1:3000/home/';


  // fetch all active auctions from endpoint
  getActiveAuctions() {
    return this.http.get(this.allActiveAuctionsEndpoint, {responseType: 'json'}).toPromise();
  }
}
