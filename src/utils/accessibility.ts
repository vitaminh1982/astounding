// Utilitaires pour l'accessibilité
export const WCAG_COLORS = {
  primary: {
    light: '#4F46E5', // Contraste 4.5:1 minimum
    dark: '#6366F1',
  },
  text: {
    primary: '#111827', // Contraste 7:1
    secondary: '#4B5563', // Contraste 4.5:1
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
  },
  feedback: {
    success: '#059669',
    error: '#DC2626',
    warning: '#D97706',
    info: '#3B82F6',
  }
};

export const FOCUS_STYLES = {
  outline: 'ring-2 ring-offset-2 ring-indigo-500',
  transition: 'all 150ms ease-in-out',
};