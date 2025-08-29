import { Routes } from '@angular/router';
import { EventsComponent } from './pages/events/events.component';
import { EventFormComponent } from './pages/event-form/event-form.component';
import { EventDetailComponent } from './pages/event-detail/event-detail.component';
import { LoginComponent } from './pages/login/login.component';
import { EventListComponent } from './pages/admin/event-list/event-list.component';

import { EventFormComponent } from './pages/event-form/event-form.component';
import { EventListComponent } from './pages/admin/event-list/event-list.component';
import { Routes } from '@angular/router';
import { EventsComponent } from './pages/events/events.component';
import { EventDetailComponent } from './pages/event-detail/event-detail.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
    // Admin Routes
    { path: 'admin/events', component: EventListComponent },
    { path: 'admin/events/new', component: EventFormComponent },
    { path: 'admin/events/edit/:id', component: EventFormComponent },


    // Public Routes
    {path: 'login/admin', component: LoginComponent},
    { path: 'events', component: EventsComponent },
    { path: 'events/:id', component: EventDetailComponent },
    { path: '', redirectTo: '/events', pathMatch: 'full' },
    { path: '**', redirectTo: '/events' } // Wildcard route for a 404 page
];
