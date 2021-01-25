import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { AddAuctionDialogComponent } from '../add-auction-dialog/add-auction-dialog.component';
import { Auth } from '@aws-amplify/auth';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})

export class SidenavComponent implements OnInit, OnDestroy {

  @ViewChild('drawer') drawer: any;

  panelOpenState = false;
  mobileQuery: MediaQueryList;
  isLoggedIn: boolean;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private dialog: MatDialog) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnInit() {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        if (user) {
          return this.isLoggedIn = true;
        }
        else {
          return this.isLoggedIn = false;
        }
      })
      .catch(() => {
        return this.isLoggedIn = false;
      })
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  closeSideNav() {
    if (this.drawer._mode == 'over') {
      this.drawer.close();
    }
  }

  // Open dialog
  addAuction() {
    const dialogRef = this.dialog.open(AddAuctionDialogComponent, {
      width: '600px',
      disableClose: true
    });
  }

  // Auth
  onLoginClick() {
    Auth.federatedSignIn();
  }

  onLogoutClick() {
    Auth.signOut();
  }
}
