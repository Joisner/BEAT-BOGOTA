import { Routes } from '@angular/router';
import { EventsComponent } from './pages/events/events.component';
import { EventFormComponent } from './pages/event-form/event-form.component';
import { EventDetailComponent } from './pages/event-detail/event-detail.component';
import { LoginComponent } from './pages/login/login.component';
import { EventListComponent } from './pages/admin/event-list/event-list.component';
import { PromotorListComponent } from './pages/admin/promotor-list/promotor-list.component';
import { DescuentoListComponent } from './pages/admin/descuento-list/descuento-list.component';
import { DescuentoFormComponent } from './pages/admin/descuento-form/descuento-form.component';
import { EtapaBoletaListComponent } from './pages/admin/etapa-boleta-list/etapa-boleta-list.component';
import { EtapaBoletaFormComponent } from './pages/admin/etapa-boleta-form/etapa-boleta-form.component';

export const routes: Routes = [
    // Admin Routes
    { path: 'admin/events', component: EventListComponent },
    { path: 'admin/events/new', component: EventFormComponent },
    { path: 'admin/events/edit/:id', component: EventFormComponent },

    // Promotores autorizados
    { path: 'admin/promotores', component: PromotorListComponent },

    // Descuentos
    { path: 'admin/descuentos', component: DescuentoListComponent },
    { path: 'admin/descuentos/new', component: DescuentoFormComponent },
    { path: 'admin/descuentos/edit/:id', component: DescuentoFormComponent },

    // Etapas de boletas
    { path: 'admin/etapas-boleta', component: EtapaBoletaListComponent },
    { path: 'admin/etapas-boleta/new', component: EtapaBoletaFormComponent },
    { path: 'admin/etapas-boleta/edit/:id', component: EtapaBoletaFormComponent },


    // Public Routes
    {path: 'login/admin', component: LoginComponent},
    { path: 'events', component: EventsComponent },
    { path: 'events/:id', component: EventDetailComponent },
    { path: '', redirectTo: '/events', pathMatch: 'full' },
    { path: '**', redirectTo: '/events' } // Wildcard route for a 404 page
];
