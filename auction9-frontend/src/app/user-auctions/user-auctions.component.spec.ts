import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAuctionsComponent } from './user-auctions.component';

describe('UserAuctionsComponent', () => {
  let component: UserAuctionsComponent;
  let fixture: ComponentFixture<UserAuctionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAuctionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAuctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
