// Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

// Components
import { AppComponent } from './app.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { DataTableComponent } from './data-table/data-table.component';
import { HomeComponent } from './home/home.component';
import { UserAuctionsComponent } from './user-auctions/user-auctions.component';
import { WonAuctionsComponent } from './won-auctions/won-auctions.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AddAuctionDialogComponent } from './add-auction-dialog/add-auction-dialog.component';
import { DataTableDetailsComponent } from './data-table/data-table-details/data-table-details.component';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    DataTableComponent,
    HomeComponent,
    UserAuctionsComponent,
    WonAuctionsComponent,
    PageNotFoundComponent,
    AddAuctionDialogComponent
    DataTableDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    MatCardModule,
    MatTooltipModule
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ],
  entryComponents: [
    AddAuctionDialogComponent
  ]
})
export class AppModule { }
