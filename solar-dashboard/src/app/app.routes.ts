import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => {
            return import('./pages/home-component/home-component').then(
                (m) => m.HomeComponent);
        },
    },
    {
        path: 'production',
        loadComponent: () => {
            return import('./pages/production-component/production-component').then(
                (m) => m.ProductionComponent);
        }
    },
    {
        path: 'login',
        loadComponent: () => {
            return import('./pages/login-component/login-component').then(
                (m) => m.LoginComponent);
        }
    }
];
