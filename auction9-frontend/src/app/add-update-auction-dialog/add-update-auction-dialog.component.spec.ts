import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateAuctionDialogComponent } from './add-update-auction-dialog.component';

describe('AddAuctionDialogComponent', () => {
  let component: AddUpdateAuctionDialogComponent;
  let fixture: ComponentFixture<AddUpdateAuctionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateAuctionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateAuctionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
