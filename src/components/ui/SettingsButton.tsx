import { motion } from 'framer-motion';

interface SettingsButtonProps {
  onClick: () => void;
}

export function SettingsButton({ onClick }: SettingsButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      whileHover={{ scale: 1.1, rotate: 90 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Socruithe (Settings)"
    >
      <span className="text-xl">⚙️</span>
    </motion.button>
  );
}
