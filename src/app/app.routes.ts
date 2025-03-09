import { Routes } from '@angular/router';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent }, // Domyślny komponent (strona główna)
    { path: 'scoreboard', component: ScoreboardComponent }, // Ścieżka do scoreboard
    { path: '**', redirectTo: '', pathMatch: 'full' } // Obsługa nieznanych tras
];
