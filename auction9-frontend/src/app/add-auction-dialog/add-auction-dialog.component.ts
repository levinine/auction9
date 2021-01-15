import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-auction-dialog',
  templateUrl: './add-auction-dialog.component.html',
  styleUrls: ['./add-auction-dialog.component.scss']
})
export class AddAuctionDialogComponent implements OnInit {

  addAuctionForm: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.addAuctionForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.maxLength(40)
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.maxLength(300)
      ]),
      price: new FormControl('', [
        Validators.required,
        Validators.pattern("^[1-9]\\d*(,\\d+)?$"), //only numbers and comma regex
        Validators.maxLength(10),
      ]),
      startDate: new FormControl('', [
        Validators.required
      ]),
      endDate: new FormControl('', [
        Validators.required
      ]),
      startTime: new FormControl('', [
        Validators.required
      ]),
      endTime: new FormControl('', [
        Validators.required
      ]),
    });
  }

}
