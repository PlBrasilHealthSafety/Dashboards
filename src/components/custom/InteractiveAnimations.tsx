import { motion } from 'framer-motion';
import type { MotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

// Hover animation variants
export const hoverScale = {
    scale: 1.05,
    transition: { duration: 0.2 }
};

export const hoverLift = {
    y: -5,
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    transition: { duration: 0.2 }
};

export const hoverRotate = {
    rotate: 5,
    scale: 1.05,
    transition: { duration: 0.2 }
};

export const hoverGlow = {
    boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
    transition: { duration: 0.2 }
};

// Interactive Button Components
interface InteractiveButtonProps extends MotionProps {
    children: ReactNode;
    variant?: 'scale' | 'lift' | 'rotate' | 'glow' | 'bounce';
    className?: string;
    onClick?: () => void;
}

export const InteractiveButton = ({
    children,
    variant = 'scale',
    className = '',
    onClick,
    ...props
}: InteractiveButtonProps) => {
    const getHoverAnimation = () => {
        switch (variant) {
            case 'lift':
                return hoverLift;
            case 'rotate':
                return hoverRotate;
            case 'glow':
                return hoverGlow;
            case 'bounce':
                return { y: -3, transition: { type: 'spring' as const, stiffness: 400 } };
            default:
                return hoverScale;
        }
    };

    return (
        <motion.button
            whileHover={getHoverAnimation()}
            whileTap={{ scale: 0.95 }}
            className={className}
            onClick={onClick}
            {...props}
        >
            {children}
        </motion.button>
    );
};

// Interactive Card Component
interface InteractiveCardProps extends MotionProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export const InteractiveCard = ({
    children,
    className = '',
    onClick,
    ...props
}: InteractiveCardProps) => {
    return (
        <motion.div
            whileHover={{
                y: -8,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.98 }}
            className={`cursor-pointer ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </motion.div>
    );
};

// Floating Action Button
interface FloatingButtonProps extends MotionProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export const FloatingButton = ({
    children,
    className = '',
    onClick,
    ...props
}: FloatingButtonProps) => {
    return (
        <motion.button
            whileHover={{
                scale: 1.1,
                rotate: 90,
                transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.9 }}
            animate={{
                y: [0, -10, 0],
                transition: {
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }
            }}
            className={`fixed bottom-6 right-6 rounded-full shadow-lg ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </motion.button>
    );
};

// Magnetic Button (follows cursor)
export const MagneticButton = ({
    children,
    className = '',
    onClick,
    ...props
}: InteractiveButtonProps) => {
    return (
        <motion.button
            whileHover={{
                scale: 1.05,
            }}
            whileTap={{ scale: 0.95 }}
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                e.currentTarget.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(0px, 0px) scale(1)';
            }}
            className={className}
            onClick={onClick}
            style={{ transition: 'transform 0.2s ease-out' }}
            {...props}
        >
            {children}
        </motion.button>
    );
};

// Ripple Effect Button
export const RippleButton = ({
    children,
    className = '',
    onClick,
    ...props
}: InteractiveButtonProps) => {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{
                scale: 0.98,
                transition: { duration: 0.1 }
            }}
            className={`relative overflow-hidden ${className}`}
            onClick={onClick}
            {...props}
        >
            <motion.div
                className="absolute inset-0 bg-white/20 rounded-full"
                initial={{ scale: 0, opacity: 1 }}
                whileTap={{
                    scale: 4,
                    opacity: 0,
                    transition: { duration: 0.4 }
                }}
            />
            {children}
        </motion.button>
    );
};

// Animated Icon Button
interface AnimatedIconButtonProps extends MotionProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    iconAnimation?: 'spin' | 'bounce' | 'pulse' | 'shake';
}

export const AnimatedIconButton = ({
    children,
    className = '',
    onClick,
    iconAnimation = 'spin',
    ...props
}: AnimatedIconButtonProps) => {
    const getIconAnimation = () => {
        switch (iconAnimation) {
            case 'bounce':
                return { y: [-2, 2, -2], transition: { duration: 0.5 } };
            case 'pulse':
                return { scale: [1, 1.2, 1], transition: { duration: 0.5 } };
            case 'shake':
                return { x: [-2, 2, -2, 2, 0], transition: { duration: 0.5 } };
            default:
                return { rotate: 180, transition: { duration: 0.3 } };
        }
    };

    return (
        <motion.button
            whileHover={{
                scale: 1.1,
                transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.9 }}
            className={className}
            onClick={onClick}
            {...props}
        >
            <motion.div whileHover={getIconAnimation()}>
                {children}
            </motion.div>
        </motion.button>
    );
};