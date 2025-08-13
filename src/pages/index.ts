// Pages barrel export with lazy loading
import { lazy } from 'react'

// Lazy loaded pages for code splitting
export const HomePage = lazy(() => import('./HomePage').then(module => ({ default: module.HomePage })))
export const FormsPage = lazy(() => import('./FormsPage').then(module => ({ default: module.FormsPage })))
export const ComponentsPage = lazy(() => import('./ComponentsPage').then(module => ({ default: module.ComponentsPage })))
export const DatabasePage = lazy(() => import('./DatabasePage').then(module => ({ default: module.DatabasePage })))

// Route configuration
export const routes = [
  { path: '/', component: HomePage, name: 'Home' },
  { path: '/forms', component: FormsPage, name: 'Forms' },
  { path: '/components', component: ComponentsPage, name: 'Components' },
  { path: '/database', component: DatabasePage, name: 'Database' },
] as const