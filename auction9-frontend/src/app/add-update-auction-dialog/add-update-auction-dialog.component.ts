import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { timeValidator } from '../custom-validators/start-end-time-validator';
import { AuctionService } from '../services/auction.service';

@Component({
  selector: 'app-add-update-auction-dialog',
  templateUrl: './add-update-auction-dialog.component.html',
  styleUrls: ['./add-update-auction-dialog.component.scss']
})
export class AddUpdateAuctionDialogComponent implements OnInit {

  addOrUpdateAuctionForm: FormGroup;
  update: boolean;
  auctionID: number;
  auctions: any;
  auction: any;

  constructor(private auctionService: AuctionService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public dialogData: any) {

    this.update = dialogData.update;
    this.auctionID = dialogData.auctionID;
    this.auctions = dialogData.auctionData;

    this.renderForm(this.auctions);
    this.auction = {};

    if (this.update) {
      this.auction = this.auctions.find(obj => obj.auctionID == this.auctionID);
      this.renderForm(this.auction);
    }
  }

  renderForm(auction): void {

    this.addOrUpdateAuctionForm = new FormGroup({
      title: new FormControl(this.update ? auction.title : '', [
        Validators.required,
        Validators.maxLength(40)
      ]),
      description: new FormControl(this.update ? auction.description : '', [
        Validators.required,
        Validators.maxLength(300)
      ]),
      price: new FormControl(this.update ? auction.price : '', [
        Validators.required,
        Validators.pattern("^[1-9]\\d*(,\\d+)?$"), //only numbers and comma regex
        Validators.maxLength(10),
      ]),
      dateGroup: new FormGroup({
        startDate: new FormControl(this.update ? moment(auction.date_from).format() : '', [
          Validators.required
        ]),
        endDate: new FormControl(this.update ? moment(auction.date_to).format() : '', [
          Validators.required
        ]),
      }),
      startTime: new FormControl(this.update ? moment(auction.date_from).format("HH:mm") : '', [
        Validators.required
      ]),
      endTime: new FormControl(this.update ? moment(auction.date_to).format("HH:mm") : '', [
        Validators.required
      ]),
    }, {
      validators: [
        timeValidator
      ],
      updateOn: "change"
    });
  }

  ngOnInit(): void {
  };

  setDates() {
    let startDate = this.addOrUpdateAuctionForm.get('dateGroup.startDate').value;
    let endDate = this.addOrUpdateAuctionForm.get('dateGroup.endDate').value;
    let startTime = this.addOrUpdateAuctionForm.controls.startTime.value;
    let endTime = this.addOrUpdateAuctionForm.controls.endTime.value;

    // Formatting start and end date
    let formattedStartDate = moment(startDate).format("YYYY-MM-DD");
    let formattedEndDate = moment(endDate).format("YYYY-MM-DD");

    // Concatenating date and time
    let concStartDateTime = moment(formattedStartDate + " " + startTime);
    let concEndDateTime = moment(formattedEndDate + " " + endTime);

    // Formatting concatenated date and time
    let startDateTime = moment(concStartDateTime).format("YYYY-MM-DD HH:mm:ss");
    let endDateTime = moment(concEndDateTime).format("YYYY-MM-DD HH:mm:ss");

    return { startDateTime, endDateTime };
  }


  onCreateAuctionClick() {
    if (this.addOrUpdateAuctionForm.invalid) {
      return;
    }
    else {
      let startDateTime = this.setDates().startDateTime;
      let endDateTime = this.setDates().endDateTime;

      // Until we implement user sign in, created_by will be hardcoded user with id=1
      this.auctionService.addAuction(
        {
          "title": this.addOrUpdateAuctionForm.controls.title.value,
          "description": this.addOrUpdateAuctionForm.controls.description.value,
          "price": this.addOrUpdateAuctionForm.controls.price.value,
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

  onUpdateAuctionClick() {
    if (this.addOrUpdateAuctionForm.invalid) {
      return;
    }
    else {
      let startDateTime = this.setDates().startDateTime;
      let endDateTime = this.setDates().endDateTime;

      this.auctionService.updateAuction(
        {
          "id": this.auctionID,
          "title": this.addOrUpdateAuctionForm.controls.title.value,
          "description": this.addOrUpdateAuctionForm.controls.description.value,
          "price": this.addOrUpdateAuctionForm.controls.price.value,
          "date_from": startDateTime,
          "date_to": endDateTime,
        }).subscribe(() => {
          this.snackBar.open('Auction updated successfully.', '',
            {
              duration: 2000,
              panelClass: ['light-snackbar']
            });
        }), (err: any) => {
          this.snackBar.open('Unable to update auction.', '',
            {
              duration: 2000,
              panelClass: ['light-snackbar']
            });
        }
    }
  }
}
