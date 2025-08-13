import { motion } from 'framer-motion';
import type { HTMLMotionProps, Variants } from 'framer-motion';
import type { ReactNode } from 'react';

// Animation variants
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 }
};

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 }
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
};

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Reusable animated components
interface AnimatedDivProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  variant?: Variants;
  delay?: number;
}

export const AnimatedDiv = ({ 
  children, 
  variant = fadeInUp, 
  delay = 0, 
  ...props 
}: AnimatedDivProps) => (
  <motion.div
    variants={variant}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.5, delay }}
    {...props}
  >
    {children}
  </motion.div>
);

export const AnimatedCard = ({ 
  children, 
  variant = scaleIn, 
  delay = 0, 
  ...props 
}: AnimatedDivProps) => (
  <motion.div
    variants={variant}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.3, delay }}
    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    whileTap={{ scale: 0.98 }}
    {...props}
  >
    {children}
  </motion.div>
);

export const AnimatedButton = ({ 
  children, 
  ...props 
}: HTMLMotionProps<'button'> & { children: ReactNode }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
    {...props}
  >
    {children}
  </motion.button>
);

export const AnimatedList = ({ 
  children, 
  ...props 
}: HTMLMotionProps<'div'> & { children: ReactNode }) => (
  <motion.div
    variants={staggerContainer}
    initial="initial"
    animate="animate"
    {...props}
  >
    {children}
  </motion.div>
);