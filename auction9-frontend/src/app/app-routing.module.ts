import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UserAuctionsComponent } from './user-auctions/user-auctions.component';
import { WonAuctionsComponent } from './won-auctions/won-auctions.component';
import { DataTableDetailsComponent } from './data-table/data-table-details/data-table-details.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'myAuctions',
    component: UserAuctionsComponent
  },
  {
    path: 'wonAuctions',
    component: WonAuctionsComponent
  },
  {
    path: 'bid/:id',
    component: DataTableDetailsComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
