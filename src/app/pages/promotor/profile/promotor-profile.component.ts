import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesPanelComponent } from '../sales-panel/sales-panel.component';
import { EventsListComponent } from '../events-list/events-list.component';
import { DiscountsComponent } from '../discounts/discounts.component';
import { CommissionsComponent } from '../commissions/commissions.component';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'app-promotor-profile',
  standalone: true,
  imports: [
    CommonModule,
    SalesPanelComponent,
    EventsListComponent,
    DiscountsComponent,
    CommissionsComponent,
    NotificationsComponent
  ],
  templateUrl: './promotor-profile.component.html',
  styleUrls: ['./promotor-profile.component.css']
})
export class PromotorProfileComponent {}
