import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function InitializingView() {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center mb-6"
      >
        <Sparkles className="w-8 h-8 text-white" />
      </motion.div>

      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Configuring Your Project</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md text-center mb-8">
        Setting up your delivery track, assigning AI agents, and building the phase pipeline...
      </p>

      <div className="space-y-3 w-72">
        {['Analyzing complexity...', 'Selecting delivery track...', 'Assigning agents...', 'Generating phase pipeline...', 'Creating documents...'].map((step, i) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.3 }}
            className="flex items-center gap-3"
          >
            <motion.div
              animate={{ scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              className="w-2 h-2 rounded-full bg-blue-500"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">{step}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
