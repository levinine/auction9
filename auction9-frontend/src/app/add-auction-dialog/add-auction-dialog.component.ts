import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { timeValidator } from '../custom-validators/start-end-time-validator';

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
    }, { validators: timeValidator, updateOn: "change" });
  };


  onCreateAuctionClick() {

    let startDate = this.addAuctionForm.controls.startDate.value;
    let endDate = this.addAuctionForm.controls.endDate.value;
    let startTime = this.addAuctionForm.controls.startTime.value;
    let endTime = this.addAuctionForm.controls.endTime.value;

    let formattedStartDate = moment(startDate).format("YYYY-MM-DD");
    let formattedEndDate = moment(endDate).format("YYYY-MM-DD");

    let startDateTime = moment(formattedStartDate + " " + startTime);
    let endDateTime = moment(formattedEndDate + " " + endTime);

    console.log("Start datetime: ", startDateTime.format());
    console.log("End datetime: ", endDateTime.format());
  }
}
