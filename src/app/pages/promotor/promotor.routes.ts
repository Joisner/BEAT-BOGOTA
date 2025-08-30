import { Routes } from '@angular/router';
import { PromotorProfileComponent } from './profile/promotor-profile.component';
import { SalesPanelComponent } from './sales-panel/sales-panel.component';
import { EventsListComponent } from './events-list/events-list.component';
import { DiscountsComponent } from './discounts/discounts.component';
import { CommissionsComponent } from './commissions/commissions.component';
import { NotificationsComponent } from './notifications/notifications.component';

export const PROMOTOR_ROUTES: Routes = [
  { path: 'profile', component: PromotorProfileComponent },
  { path: 'sales', component: SalesPanelComponent },
  { path: 'events', component: EventsListComponent },
  { path: 'discounts', component: DiscountsComponent },
  { path: 'commissions', component: CommissionsComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: '', redirectTo: 'profile', pathMatch: 'full' }
];
