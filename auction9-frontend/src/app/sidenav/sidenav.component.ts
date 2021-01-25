import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { Auth } from '@aws-amplify/auth';
import { AddUpdateAuctionDialogComponent } from '../add-update-auction-dialog/add-update-auction-dialog.component';

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
    this.dialog.open(AddUpdateAuctionDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {
        update: false
      }
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
