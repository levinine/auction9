import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UserAuctionsComponent } from './user-auctions/user-auctions.component';
import { WonAuctionsComponent } from './won-auctions/won-auctions.component';
import { DataTableDetailsComponent } from './data-table/data-table-details/data-table-details.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/auctions',
    pathMatch: 'full'
  },
  {
    path: 'auctions',
    component: HomeComponent
  },
  {
    path: 'myAuctions',
    component: UserAuctionsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'wonAuctions',
    component: WonAuctionsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'auctions/:id',
    component: DataTableDetailsComponent,
    canActivate: [AuthGuard]
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
