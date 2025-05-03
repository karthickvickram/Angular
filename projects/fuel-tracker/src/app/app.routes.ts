import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'entry',
        loadComponent: () => import('./fuel-entry/fuel-entry.component').then(m => m.FuelEntryComponent)
    },
    { 
        path: 'log', 
        loadComponent: () => import('./fuel-list/fuel-list.component').then(m => m.FuelListComponent) 
    },
    { 
        path: 'chart', 
        loadComponent: () => import('./fuel-dashboard/fuel-dashboard.component').then(m => m.FuelDashboardComponent) 
    },
    { 
        path: 'metrics', loadComponent: () => import('./fuel-dashboard/fuel-dashboard.component').then(m => m.FuelDashboardComponent) 
    }
];
