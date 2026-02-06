import { useState, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChangeNameModalProps {
  isOpen: boolean;
  currentName: string;
  onSave: (name: string) => void;
  onClose: () => void;
}

export function ChangeNameModal({ isOpen, currentName, onSave, onClose }: ChangeNameModalProps) {
  const [name, setName] = useState(currentName);
  
  // Reset local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setName(currentName);
    }
  }, [isOpen, currentName]);

  const trimmedName = name.trim();
  const isValid = trimmedName.length > 0;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onSave(trimmedName);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative bg-gradient-to-br from-[#1a1033] to-[#162447] rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-white/10"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
        >
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Athraigh d'ainm ✏️
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="new-name" className="sr-only">
                D'ainm nua
              </label>
              <input
                id="new-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xl p-4 rounded-2xl bg-white/10 backdrop-blur-sm 
                           border-2 border-white/20 text-white placeholder-white/50
                           focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50
                           transition-all duration-200"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <motion.button
                type="button"
                onClick={onClose}
                className="flex-1 p-3 rounded-xl bg-white/10 text-white font-semibold
                           hover:bg-white/20 transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                Cealaigh
              </motion.button>

              <motion.button
                type="submit"
                disabled={!isValid}
                className="flex-1 p-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500
                           text-white font-bold shadow-lg
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
                whileTap={isValid ? { scale: 0.95 } : {}}
              >
                Sábháil ✓
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
