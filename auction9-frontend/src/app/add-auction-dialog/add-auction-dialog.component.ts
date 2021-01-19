import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { timeValidator } from '../custom-validators/start-end-time-validator';
import { AuctionService } from '../services/auction.service';

@Component({
  selector: 'app-add-auction-dialog',
  templateUrl: './add-auction-dialog.component.html',
  styleUrls: ['./add-auction-dialog.component.scss']
})
export class AddAuctionDialogComponent implements OnInit {

  addAuctionForm: FormGroup;

  constructor(private auctionService: AuctionService,
    private snackBar: MatSnackBar,) { }

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

    // Formatting start and end date
    let formattedStartDate = moment(startDate).format("YYYY-MM-DD");
    let formattedEndDate = moment(endDate).format("YYYY-MM-DD");

    // Concatenating date and time
    let concStartDateTime = moment(formattedStartDate + " " + startTime);
    let concEndDateTime = moment(formattedEndDate + " " + endTime);

    // Formatting concatenated date and time
    let startDateTime = moment(concStartDateTime).format("YYYY-MM-DD HH:mm:ss");
    let endDateTime = moment(concEndDateTime).format("YYYY-MM-DD HH:mm:ss");


    if (this.addAuctionForm.invalid) {
      return;
    }
    else {
      // Until we implement user sign in, created_by will be hardcoded user with id=1
      this.auctionService.addAuction(
        {
          "title": this.addAuctionForm.controls.title.value,
          "description": this.addAuctionForm.controls.description.value,
          "price": this.addAuctionForm.controls.price.value,
          "date_from": startDateTime,
          "date_to": endDateTime,
          "created_by": 1
        }).subscribe(() => {
          this.snackBar.open('Auction created successfully.', '',
            {
              duration: 2000,
              panelClass: ['light-snackbar']
            });
        }), (err: any) => {
          this.snackBar.open('Unable to create auction.', '',
            {
              duration: 2000,
              panelClass: ['light-snackbar']
            });
        }
    }
  }
}
