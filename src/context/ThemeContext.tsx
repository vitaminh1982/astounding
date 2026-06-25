import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

const STORAGE_KEY = 'app-theme';

// Helper function to get initial theme
const getInitialTheme = (defaultTheme: Theme, storageKey: string): Theme => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return defaultTheme;
  }

  try {
    const savedTheme = localStorage.getItem(storageKey) as Theme | null;
    if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
      return savedTheme;
    }
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error);
  }

  return defaultTheme;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'system',
  storageKey = STORAGE_KEY 
}) => {
  const [theme, setThemeState] = useState<Theme>(() => 
    getInitialTheme(defaultTheme, storageKey)
  );

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const initial = getInitialTheme(defaultTheme, storageKey);
    if (initial === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return initial as 'light' | 'dark';
  });

  // Memoize the theme setter to prevent unnecessary re-renders
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  // Memoize toggle function
  const toggleTheme = useCallback(() => {
    setThemeState((prevTheme) => {
      if (prevTheme === 'light') return 'dark';
      if (prevTheme === 'dark') return 'system';
      return 'light';
    });
  }, []);

  // Apply theme changes to DOM and localStorage
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove both classes first to avoid conflicts
    root.classList.remove('light', 'dark');
    
    const resolved = theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;

    root.classList.add(resolved);
    
    // Update color-scheme for better browser support
    root.style.colorScheme = resolved;
    setResolvedTheme(resolved);

    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }, [theme, storageKey]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        const resolved = e.matches ? 'dark' : 'light';
        root.classList.add(resolved);
        root.style.colorScheme = resolved;
        setResolvedTheme(resolved);
      }
    };

    // Modern browsers
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ theme, resolvedTheme, toggleTheme, setTheme }),
    [theme, resolvedTheme, toggleTheme, setTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
