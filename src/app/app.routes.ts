import { Routes } from '@angular/router';
import { EventsComponent } from './pages/events-management/events/events.component';
import { EventFormComponent } from './pages/events-management/event-form/event-form.component';
import { EventDetailComponent } from './pages/events-management/event-detail/event-detail.component';
import { LoginComponent } from './pages/login/login.component';
import { EventListComponent } from './pages/admin/event-list/event-list.component';
import { PromotorListComponent } from './pages/admin/promotor-list/promotor-list.component';
import { DescuentoListComponent } from './pages/admin/descuento-list/descuento-list.component';
import { DescuentoFormComponent } from './pages/admin/descuento-form/descuento-form.component';
import { EtapaBoletaListComponent } from './pages/admin/etapa-boleta-list/etapa-boleta-list.component';
import { EtapaBoletaFormComponent } from './pages/admin/etapa-boleta-form/etapa-boleta-form.component';
import { AuthGuard } from './core/guards/auth.guard';
import { PromoterFormComponent } from './pages/admin/promoter-form/promoter-form.component';
import {UsersListComponent} from './pages/admin/users-list/users-list.component';
import {UsersFormComponent} from './pages/admin/users-form/users-form.component';
export const routes: Routes = [
    // Admin Routes - Protected with AuthGuard
    { 
      path: 'admin',
      canActivate: [AuthGuard],
      children: [
        {path: 'users', component: UsersListComponent},
        {path: 'users/new', component: UsersFormComponent},
        {path: 'users/edit/:id', component: UsersFormComponent},

        { path: 'events', component: EventListComponent },
        { path: 'events/new', component: EventFormComponent },
        { path: 'events/edit/:id', component: EventFormComponent },
        
        // Promotores autorizados
        { path: 'promotores', component: PromotorListComponent },
        { path: 'promoters/new', component: PromoterFormComponent},
        { path: 'promoters/edit/:id', component: PromoterFormComponent},
        
        // Descuentos
        { path: 'descuentos', component: DescuentoListComponent },
        { path: 'descuentos/new', component: DescuentoFormComponent },
        { path: 'descuentos/edit/:id', component: DescuentoFormComponent },
        
        // Etapas de boletas
        { path: 'etapas-boleta', component: EtapaBoletaListComponent },
        { path: 'etapas-boleta/new', component: EtapaBoletaFormComponent },
        { path: 'etapas-boleta/edit/:id', component: EtapaBoletaFormComponent },
      ]
    },


    // Public Routes
    {path: 'login/admin', component: LoginComponent},
    { path: 'events', component: EventsComponent },
    { path: 'events/:id', component: EventDetailComponent },
    {
        path: 'promotor',
        loadChildren: () => import('./pages/promotor/promotor.routes').then(m => m.PROMOTOR_ROUTES)
    },
    {
        path: 'asistente',
        loadChildren: () => import('./pages/asistente/asistente.routes').then(m => m.ASISTENTE_ROUTES)
    },
    {
        path: 'cart',
        loadChildren: () => import('./pages/cart/cart.routes').then(m => m.CART_ROUTES)
    },
    {
        path: 'checkout',
        loadChildren: () => import('./pages/checkout/checkout.routes').then(m => m.CHECKOUT_ROUTES)
    },
    { path: '', redirectTo: '/events', pathMatch: 'full' },
    { path: '**', redirectTo: '/events' } // Wildcard route for a 404 page
];
