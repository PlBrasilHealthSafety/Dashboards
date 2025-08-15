import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { PageTransition, ProtectedRoute, PublicRoute } from '@/components/custom'
import { AppLayout } from '@/components/layout'

// Lazy load all pages for code splitting
const HomePage = lazy(() => import('@/pages/HomePage').then(module => ({ default: module.HomePage })))
const TVDashboard = lazy(() => import('@/pages/TVDashboard').then(module => ({ default: module.TVDashboard })))
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
        {/* Root redirect */}
        <Route index element={<Navigate to="/auth" replace />} />
        
        {/* Public auth route */}
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <PageTransition>
                <AuthPage />
              </PageTransition>
            </PublicRoute>
          }
        />
        
        {/* TV Dashboard - fullscreen without layout */}
        <Route
          path="/tv-dashboard"
          element={
            <ProtectedRoute>
              <PageTransition>
                <TVDashboard />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        
        {/* Protected routes with AppLayout */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <PageTransition>
                <HomePage />
              </PageTransition>
            }
          />
        </Route>
        
        <Route 
          path="/components" 
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <PageTransition>
                <ComponentsPage />
              </PageTransition>
            }
          />
        </Route>
        
        <Route 
          path="/database" 
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <PageTransition>
                <DatabasePage />
              </PageTransition>
            }
          />
        </Route>
        
        <Route 
          path="/forms" 
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <PageTransition>
                <FormsPage />
              </PageTransition>
            }
          />
        </Route>
        
        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Suspense>
  )
}
