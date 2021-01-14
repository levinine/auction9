import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableDetailsComponent } from './data-table-details.component';

describe('DataTableDetailsComponent', () => {
  let component: DataTableDetailsComponent;
  let fixture: ComponentFixture<DataTableDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataTableDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTableDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
