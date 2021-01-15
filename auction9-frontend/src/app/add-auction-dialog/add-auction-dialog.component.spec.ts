import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAuctionDialogComponent } from './add-auction-dialog.component';

describe('AddAuctionDialogComponent', () => {
  let component: AddAuctionDialogComponent;
  let fixture: ComponentFixture<AddAuctionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAuctionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAuctionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
