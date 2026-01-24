import { motion } from 'framer-motion';

interface StarCounterProps {
  stars: number;
  showLabel?: boolean;
}

export function StarCounter({ stars, showLabel = true }: StarCounterProps) {
  return (
    <motion.div 
      className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-full px-4 py-2"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <motion.span 
        className="text-2xl"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ⭐
      </motion.span>
      <span className="text-xl font-bold text-yellow-400">{stars}</span>
      {showLabel && (
        <span className="text-white/60 text-sm hidden sm:inline">réaltaí</span>
      )}
    </motion.div>
  );
}
