import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeName = 'pure-dark' | 'soft-gold' | 'ocean-calm' | 'sunset-warm' | 'summoners-rift';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const VALID_THEMES: ThemeName[] = ['pure-dark', 'soft-gold', 'ocean-calm', 'sunset-warm', 'summoners-rift'];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(() => {
    const saved = localStorage.getItem('slot-machine-theme');
    if (saved && VALID_THEMES.includes(saved as ThemeName)) {
      return saved as ThemeName;
    }
    return 'pure-dark';
  });

  useEffect(() => {
    // Remove all theme classes
    document.body.classList.remove('theme-pure-dark', 'theme-soft-gold', 'theme-ocean-calm', 'theme-sunset-warm', 'theme-summoners-rift');
    // Add current theme class
    document.body.classList.add(`theme-${theme}`);
    // Save to localStorage
    localStorage.setItem('slot-machine-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
