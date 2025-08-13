import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { PageTransition } from '@/components/custom'
import { AppLayout } from '@/components/layout'

// Lazy load all pages for code splitting
const HomePage = lazy(() => import('@/pages/HomePage').then(module => ({ default: module.HomePage })))
const ComponentsPage = lazy(() => import('@/pages/ComponentsPage').then(module => ({ default: module.ComponentsPage })))
const DatabasePage = lazy(() => import('@/pages/DatabasePage').then(module => ({ default: module.DatabasePage })))
const FormsPage = lazy(() => import('@/pages/FormsPage').then(module => ({ default: module.FormsPage })))
const AuthPage = lazy(() => import('@/components/custom/AuthPage').then(module => ({ default: module.AuthPage })))

// Loading component
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )
}

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route
            path="home"
            element={
              <PageTransition>
                <HomePage />
              </PageTransition>
            }
          />
          <Route
            path="components"
            element={
              <PageTransition>
                <ComponentsPage />
              </PageTransition>
            }
          />
          <Route
            path="database"
            element={
              <PageTransition>
                <DatabasePage />
              </PageTransition>
            }
          />
          <Route
            path="forms"
            element={
              <PageTransition>
                <FormsPage />
              </PageTransition>
            }
          />
          <Route
            path="auth"
            element={
              <PageTransition>
                <AuthPage />
              </PageTransition>
            }
          />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
