import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import type { ReactNode } from 'react';

// Entry/Exit animation variants
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: -50
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 50,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  }
};

export const slideUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 100
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    y: -100,
    transition: {
      duration: 0.3,
      ease: 'easeIn'
    }
  }
};

export const expandVariants: Variants = {
  hidden: {
    opacity: 0,
    height: 0,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    height: 'auto',
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    height: 0,
    scale: 0.8,
    transition: {
      duration: 0.3,
      ease: 'easeIn'
    }
  }
};

// Animated Modal Component
interface AnimatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export const AnimatedModal = ({ 
  isOpen, 
  onClose, 
  children, 
  className = '' 
}: AnimatedModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          
          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}
          >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Animated Collapsible Component
interface AnimatedCollapsibleProps {
  isOpen: boolean;
  children: ReactNode;
  className?: string;
}

export const AnimatedCollapsible = ({ 
  isOpen, 
  children, 
  className = '' 
}: AnimatedCollapsibleProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={expandVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Animated List Item with stagger
interface AnimatedListItemProps {
  children: ReactNode;
  index: number;
  className?: string;
}

export const AnimatedListItem = ({ 
  children, 
  index, 
  className = '' 
}: AnimatedListItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.1,
        ease: 'easeOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Animated Notification/Toast
interface AnimatedNotificationProps {
  isVisible: boolean;
  children: ReactNode;
  position?: 'top' | 'bottom';
  className?: string;
}

export const AnimatedNotification = ({ 
  isVisible, 
  children, 
  position = 'top',
  className = '' 
}: AnimatedNotificationProps) => {
  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: position === 'top' ? -100 : 100,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut'
      }
    },
    exit: {
      opacity: 0,
      y: position === 'top' ? -100 : 100,
      scale: 0.8,
      transition: {
        duration: 0.3,
        ease: 'easeIn'
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`fixed ${position === 'top' ? 'top-4' : 'bottom-4'} right-4 z-50 ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};