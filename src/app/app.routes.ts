import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BatchreleaseComponent } from './batchrelease/batchrelease.component';
import { SettingsComponent } from './settings/settings.component';
import { ArticleMasterComponent } from './articlemaster/articlemaster.component';
import { DatamigrationComponent } from './datamigration/datamigration.component';
import { CurrentStatusMpvComponent } from './current-status-mpv/current-status-mpv.component';
import { CapaFollowupComponent } from './capa-followup/capa-followup.component';
import { MasterBySapnoComponent } from './master-by-sapno/master-by-sapno.component';

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
    },
    {
        path: 'articlemaster',
        component: ArticleMasterComponent,
    },
    {
        path: 'datamigration',
        component: DatamigrationComponent,
    },
    {
        path: 'currentstatusmpv',
        component: CurrentStatusMpvComponent,
    },
    {
        path: 'capafollowup',
        component: CapaFollowupComponent
    },
    {
        path: 'masterbysapno',
        component: MasterBySapnoComponent
    }
];
