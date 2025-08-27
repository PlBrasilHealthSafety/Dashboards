# Components Guide

This guide provides an overview of all components available in the application, organized by category and purpose.

## Component Categories

### UI Components (`src/components/ui/`)
Base Shadcn/ui components that provide the foundation for the design system:

- **Button** - Primary action buttons with variants
- **Card** - Container component for content sections
- **Input** - Form input fields with validation
- **Badge** - Status indicators and labels

### Custom Components (`src/components/custom/`)

#### Authentication Components
- **AuthProvider** - Context provider for authentication state
- **AuthPage** - Combined login/register page
- **LoginForm** - User login form with validation
- **RegisterForm** - User registration form
- **ProtectedRoute** - Route wrapper for authenticated users
- **PublicRoute** - Route wrapper for public access
- **UserProfile** - User profile management component

#### Dashboard Components
- **SimpleDashboard3D** - 3D dashboard with Three.js integration
- **MedicalDashboard** - Specialized medical data dashboard
- **ExecutiveLayoutDashboard** - Executive-level analytics dashboard
- **DetailedSectorAnalysis** - Sector-specific analysis component

#### Form Components
- **FormField** - Advanced form field with validation
- **SimpleFormField** - Basic form field component
- **ContactForm** - Contact form with email integration
- **FormExample** - Demo form showcasing features

#### Animation Components
- **AnimatedComponents** - Collection of animated UI elements
- **AnimatedEntryExit** - Entry/exit animations wrapper
- **InteractiveAnimations** - Interactive animation demos
- **PageTransition** - Page transition wrapper

#### Visualization Components
- **Charts** - Chart components using Recharts
- **Carousel** - Image/content carousel component
- **CarouselVariants** - Different carousel implementations
- **HeroSlides** - Hero section slideshow
- **TVChartSlides** - TV-optimized chart slides

#### Notification Components
- **ContratoNotificationOverlay** - Video notification overlay for new contracts

#### 3D Components
- **SimpleThreeJS** - Basic Three.js integration example

### Layout Components (`src/components/layout/`)
- **AppLayout** - Main application layout wrapper
- **Header** - Application header with navigation
- **Footer** - Application footer
- **Sidebar** - Navigation sidebar component

### Example Components (`src/components/examples/`)
Demo components showcasing library integrations:

- **CarouselExample** - Swiper.js carousel demo
- **ChartsExample** - Recharts visualization demo
- **FirestoreExample** - Firestore operations demo
- **FormExample** - React Hook Form demo
- **FramerMotionExample** - Framer Motion animations demo

## Usage Patterns

### Importing Components
```typescript
// UI components
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// Custom components
import { AuthProvider } from '@/components/custom/AuthProvider'
import { MedicalDashboard } from '@/components/custom/MedicalDashboard'

// Layout components
import { AppLayout } from '@/components/layout/AppLayout'
```

### Component Composition
Most components are designed to work together seamlessly:

```typescript
<AppLayout>
  <AuthProvider>
    <ProtectedRoute>
      <MedicalDashboard />
    </ProtectedRoute>
  </AuthProvider>
</AppLayout>
```

## Styling and Theming

All components use:
- **Tailwind CSS** for utility-first styling
- **CSS Variables** for theming support
- **Shadcn/ui** design tokens
- **Responsive design** principles

## Component Details

### ContratoNotificationOverlay

A specialized overlay component that displays a video notification when new contracts are created. Used primarily in the TV Dashboard for visual notifications.

#### Props
```typescript
interface ContratoNotificationOverlayProps {
  contrato: {
    razaoSocial: string
    nomeFantasia: string
    dataInicioContrato: string
    userId: string
  }
  onComplete: () => void
}
```

#### Features
- **Video Playback**: Plays a notification video (`novo-contrato-video.mp4`)
- **Two-Phase Display**: Video phase followed by contract information phase
- **Auto-progression**: Automatically transitions between phases
- **Responsive Design**: Optimized for TV dashboard display
- **Accessibility**: Includes video controls and fallback content

#### Usage Example
```typescript
import { ContratoNotificationOverlay } from '@/components/custom/ContratoNotificationOverlay'

function Dashboard() {
  const [showNotification, setShowNotification] = useState(false)
  const [contractData, setContractData] = useState(null)

  const handleComplete = () => {
    setShowNotification(false)
    setContractData(null)
  }

  return (
    <div>
      {/* Dashboard content */}
      
      {contractData && showNotification && (
        <ContratoNotificationOverlay
          contrato={contractData}
          onComplete={handleComplete}
        />
      )}
    </div>
  )
}
```

#### Video Requirements
- **File Location**: `public/novo-contrato-video.mp4`
- **Supported Formats**: MP4 (primary), WebM (fallback)
- **Recommended Specs**: 1920x1080, H.264 codec, 30fps
- **Duration**: 5-10 seconds for optimal user experience

## Best Practices

1. **Import from index files** when available
2. **Use TypeScript props** for type safety
3. **Follow naming conventions** (PascalCase for components)
4. **Compose components** rather than creating monolithic ones
5. **Use the design system** consistently across components
6. **Test video components** across different browsers and devices
7. **Provide fallback content** for accessibility and error handling