import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        canActivate:[authGuard],
        loadComponent: () => {
            return import('./pages/home-component/home-component').then(
                (m) => m.HomeComponent);
        },
    },
    {
        path: 'production',
        canActivate:[authGuard],
        loadComponent: () => {
            return import('./pages/production-component/production-component').then(
                (m) => m.ProductionComponent);
        }
    },
    {
        path: 'analysis',
        canActivate:[authGuard],
        loadComponent: () => {
            return import('./pages/scenario-analysis-component/scenario-analysis-component').then(
                (m) => m.ScenarioAnalysisComponent);
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
