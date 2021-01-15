import { TestBed } from '@angular/core/testing';

import { AuctionFetchService } from './auction-fetch.service';

describe('AuctionFetchService', () => {
  let service: AuctionFetchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuctionFetchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
