import { Routes } from '@angular/router';

const TITLE = 'tf-aws-demo';

export const routes: Routes = [
  {
    path: '',
    title: `${TITLE} · Sitio estático en AWS con Terraform`,
    loadComponent: () => import('./features/home').then((m) => m.Home),
  },
  {
    path: 'arquitectura',
    title: `Arquitectura · ${TITLE}`,
    loadComponent: () => import('./features/architecture').then((m) => m.Architecture),
  },
  {
    path: 'despliegue',
    title: `Despliegue · ${TITLE}`,
    loadComponent: () => import('./features/deploy').then((m) => m.Deploy),
  },
  {
    path: 'roadmap',
    title: `Roadmap · ${TITLE}`,
    loadComponent: () => import('./features/roadmap').then((m) => m.Roadmap),
  },
  { path: '**', redirectTo: '' },
];
