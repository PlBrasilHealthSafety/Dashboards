// Authentication components
export { AuthProvider } from './AuthProvider'
export { AuthPage } from './AuthPage'
export { LoginForm } from './LoginForm'
export { RegisterForm } from './RegisterForm'
export { ProtectedRoute } from './ProtectedRoute'
export { PublicRoute } from './PublicRoute'
export { UserProfile } from './UserProfile'

// Form components
export { ContactForm } from './ContactForm'
export { FormField } from './FormField'
export { FormExample } from './FormExample'
export { SimpleFormField } from './SimpleFormField'

// UI components
export { Carousel } from './Carousel'
export type { CarouselItem } from './Carousel'

// Carousel variants
export { 
  ImageCarousel, 
  CardCarousel, 
  TestimonialCarousel, 
  AutoplayCarousel, 
  MultiSlideCarousel 
} from './CarouselVariants'

// Charts
export { 
  CustomLineChart, 
  CustomBarChart, 
  CustomPieChart, 
  MultiLineChart 
} from './Charts'

// Animation components
export { 
  AnimatedDiv, 
  AnimatedCard, 
  AnimatedButton, 
  AnimatedList,
  fadeInUp,
  fadeIn,
  slideInLeft,
  slideInRight,
  scaleIn,
  staggerContainer
} from './AnimatedComponents'

export { 
  AnimatedModal, 
  AnimatedCollapsible, 
  AnimatedListItem, 
  AnimatedNotification 
} from './AnimatedEntryExit'

export { 
  InteractiveButton, 
  InteractiveCard, 
  FloatingButton, 
  MagneticButton, 
  RippleButton, 
  AnimatedIconButton 
} from './InteractiveAnimations'

export { PageTransition } from './PageTransition'

// Dashboard components
export { ExecutiveLayoutDashboard } from './ExecutiveLayoutDashboard'
export * from './MedicalDashboard'