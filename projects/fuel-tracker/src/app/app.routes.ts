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
        path: 'metrics', loadComponent: () => import('./fuel-metrics/fuel-metrics.component').then(m => m.FuelMetricsComponent) 
    },
    { 
        path: 'chart', 
        loadComponent: () => import('./fuel-chart/fuel-chart.component').then(m => m.FuelChartComponent) 
    }
];
