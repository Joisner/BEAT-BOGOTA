import { Routes } from '@angular/router';
import { AsistenteProfileComponent } from './asistente-profile.component';

export const ASISTENTE_ROUTES: Routes = [
  { path: 'profile', component: AsistenteProfileComponent },
  { path: '', redirectTo: 'profile', pathMatch: 'full' }
];
