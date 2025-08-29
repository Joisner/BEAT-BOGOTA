import { Routes } from '@angular/router';
import { EventsComponent } from './pages/events/events.component';
import { EventFormComponent } from './pages/event-form/event-form.component';
import { EventDetailComponent } from './pages/event-detail/event-detail.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
    {path: 'login/admin', component: LoginComponent},
    { path: 'events', component: EventsComponent },
    { path: 'events/new', component: EventFormComponent },
    { path: 'events/:id', component: EventDetailComponent },
    { path: '', redirectTo: '/events', pathMatch: 'full' },
    { path: '**', redirectTo: '/events' } // Wildcard route for a 404 page
];
