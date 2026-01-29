import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useTheme, type ThemeName } from '../contexts/ThemeContext';

const themes = [
  { id: 'pure-dark' as ThemeName, label: 'Pure Dark', icon: '🌑', color: '#3a3a3a' },
  { id: 'soft-gold' as ThemeName, label: 'Soft Gold', icon: '✨', color: '#C9A961' },
  { id: 'ocean-calm' as ThemeName, label: 'Ocean Calm', icon: '🌊', color: '#5E9EA0' },
  { id: 'sunset-warm' as ThemeName, label: 'Sunset Warm', icon: '🌅', color: '#E89B8E' },
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const currentTheme = themes.find(t => t.id === theme) || themes[0];

  return (
    <div className="fixed top-4 right-4 z-50">
      <motion.button
        className="theme-selector-button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Change theme"
      >
        <span className="text-2xl">{currentTheme.icon}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="theme-selector-dropdown"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {themes.map((t) => (
              <motion.button
                key={t.id}
                className={`theme-option ${theme === t.id ? 'active' : ''}`}
                onClick={() => {
                  setTheme(t.id);
                  setIsOpen(false);
                }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  borderLeftColor: t.color,
                }}
              >
                <span className="text-xl mr-2">{t.icon}</span>
                <span className="font-bold">{t.label}</span>
                {theme === t.id && (
                  <motion.span
                    className="ml-auto text-green-400"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    ✓
                  </motion.span>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <div
          className="fixed inset-0 -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
