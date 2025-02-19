import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BatchreleaseComponent } from './batchrelease/batchrelease.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'batchrelease',
        component: BatchreleaseComponent,
    },
    {
        path: 'settings',
        component: SettingsComponent,
    }
];
