import { motion } from 'framer-motion';

interface DinoCharacterProps {
  size?: 'small' | 'medium' | 'large';
  mood?: 'happy' | 'excited' | 'thinking' | 'sad' | 'celebrating';
  className?: string;
}

const sizeClasses = {
  small: 'text-4xl',
  medium: 'text-6xl',
  large: 'text-8xl',
};

// Different dino expressions based on mood
const moodEmojis = {
  happy: '🦕',
  excited: '🦖',
  thinking: '🦕',
  sad: '🦕',
  celebrating: '🦖',
};

export function DinoCharacter({ 
  size = 'medium', 
  mood = 'happy',
  className = '',
}: DinoCharacterProps) {
  const baseAnimation = {
    y: [0, -5, 0],
  };
  
  const moodAnimations = {
    happy: {
      ...baseAnimation,
      rotate: [0, 2, -2, 0],
    },
    excited: {
      y: [0, -10, 0],
      rotate: [0, 5, -5, 0],
      scale: [1, 1.05, 1],
    },
    thinking: {
      ...baseAnimation,
      rotate: [0, 5, 5, 0],
    },
    sad: {
      y: [0, 2, 0],
      rotate: [-3, -3, -3],
    },
    celebrating: {
      y: [0, -15, 0],
      rotate: [0, 10, -10, 0],
      scale: [1, 1.1, 1],
    },
  };
  
  return (
    <motion.div 
      className={`inline-block ${sizeClasses[size]} ${className}`}
      animate={moodAnimations[mood]}
      transition={{
        duration: mood === 'celebrating' ? 0.5 : 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <span role="img" aria-label="Dino the dinosaur">
        {moodEmojis[mood]}
      </span>
      
      {/* Astronaut helmet overlay for space theme */}
      {size !== 'small' && (
        <motion.span 
          className="absolute -top-1 -right-1 text-lg"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🪐
        </motion.span>
      )}
    </motion.div>
  );
}

// Speech bubble component for Dino
interface DinoBubbleProps {
  message: string;
  children?: React.ReactNode;
}

export function DinoBubble({ message, children }: DinoBubbleProps) {
  return (
    <motion.div 
      className="flex items-start gap-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <DinoCharacter size="small" mood="happy" />
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl rounded-bl-none p-4 max-w-sm">
        <p className="text-white">{message}</p>
        {children}
      </div>
    </motion.div>
  );
}
