#!/bin/bash
# Fix hardcoded color classes → DS tokens across all TSX files
set -e
SRC="src"

r() {
  find "$SRC" \( -name "*.tsx" -o -name "*.ts" \) | xargs sed -i '' "s/$1/$2/g" 2>/dev/null || true
}

echo "🎨 TEXT COLORS..."
# Strong foreground
r 'text-gray-900' 'text-foreground'
r 'dark:text-gray-100' 'dark:text-foreground'
r 'text-gray-800' 'text-on-surface'
r 'dark:text-gray-200' 'dark:text-on-surface-variant'
r 'text-gray-100' 'text-foreground'

# Body / on-surface
r 'text-gray-700' 'text-on-surface'
r 'dark:text-gray-300' 'dark:text-muted-foreground'
r 'text-gray-300' 'text-muted-foreground'

# Muted
r 'text-gray-600' 'text-muted-foreground'
r 'dark:text-gray-400' 'dark:text-muted-foreground'
r 'text-gray-500' 'text-muted-foreground'
r 'text-gray-400' 'text-outline'
r 'text-gray-200' 'text-on-surface-variant'
r 'dark:text-gray-500' 'dark:text-outline'

# Slate
r 'text-slate-900' 'text-foreground'
r 'text-slate-800' 'text-on-surface'
r 'text-slate-700' 'text-on-surface'
r 'text-slate-600' 'text-muted-foreground'
r 'text-slate-500' 'text-muted-foreground'
r 'text-slate-400' 'text-outline'
r 'text-slate-300' 'text-muted-foreground'
r 'dark:text-slate-300' 'dark:text-muted-foreground'
r 'dark:text-slate-400' 'dark:text-outline'

echo "🎨 BACKGROUNDS..."
r 'bg-gray-950' 'bg-background'
r 'bg-gray-900' 'bg-background'
r 'dark:bg-gray-900' 'dark:bg-background'
r 'bg-gray-800' 'bg-surface-container-high'
r 'dark:bg-gray-800' 'dark:bg-surface-container-high'
r 'bg-gray-700' 'bg-surface-container-highest'
r 'dark:bg-gray-700' 'dark:bg-surface-container-highest'
r 'bg-gray-600' 'bg-surface-container-highest'
r 'bg-gray-500' 'bg-outline'
r 'bg-gray-400' 'bg-outline-variant'
r 'bg-gray-300' 'bg-surface-container'
r 'bg-gray-200' 'bg-surface-container'
r 'dark:bg-gray-200' 'dark:bg-surface-container'
r 'bg-gray-100' 'bg-surface-container-low'
r 'dark:bg-gray-100' 'dark:bg-surface-container-low'
r 'bg-gray-50' 'bg-surface-container-low'
r 'dark:bg-gray-50' 'dark:bg-surface-container-low'

# White / dark popover surfaces
r "dark:bg-\[#1a1a1a\]" 'dark:bg-surface-container-low'
r "bg-\[#1a1a1a\]" 'bg-surface-container-low'
r "dark:bg-\[#2a2a2a\]" 'dark:bg-surface-container'
r "bg-\[#2a2a2a\]" 'bg-surface-container'

# Slate BG
r 'bg-slate-900' 'bg-background'
r 'bg-slate-800' 'bg-surface-container-high'
r 'dark:bg-slate-800' 'dark:bg-surface-container-high'
r 'bg-slate-700' 'bg-surface-container-highest'
r 'bg-slate-100' 'bg-surface-container-low'
r 'bg-slate-50' 'bg-surface-container-low'

echo "🎨 BORDERS..."
r 'border-gray-100' 'border-border'
r 'border-gray-200' 'border-border'
r 'border-gray-300' 'border-border'
r 'border-gray-400' 'border-outline-variant'
r 'border-gray-500' 'border-outline'
r 'border-gray-600' 'border-border'
r 'border-gray-700' 'border-border'
r 'dark:border-gray-100' 'dark:border-border'
r 'dark:border-gray-200' 'dark:border-border'
r 'dark:border-gray-300' 'dark:border-border'
r 'dark:border-gray-600' 'dark:border-border'
r 'dark:border-gray-700' 'dark:border-border'
r 'border-slate-200' 'border-border'
r 'border-slate-300' 'border-border'
r 'border-slate-600' 'border-border'
r 'border-slate-700' 'border-border'
r 'dark:border-slate-600' 'dark:border-border'
r 'dark:border-slate-700' 'dark:border-border'

echo "🎨 WHITE / BLACK text..."
# Keep text-white on gradient buttons (dark bg) but replace generic usage
# We map text-black → text-foreground for light contexts
r 'text-black dark:' 'text-foreground dark:'
r 'hover:text-black' 'hover:text-foreground'

echo "🎨 INDIGO / BLUE / PURPLE → DS tokens..."
r 'text-indigo-600' 'text-primary-green'
r 'dark:text-indigo-400' 'dark:text-primary-green'
r 'text-indigo-400' 'text-primary-green'
r 'bg-indigo-600' 'bg-primary'
r 'bg-indigo-500' 'bg-primary'
r 'border-indigo-500' 'border-primary-green'
r 'focus:ring-indigo-500' 'focus:ring-ring'
r 'text-blue-500' 'text-tertiary'
r 'text-blue-600' 'text-tertiary'
r 'dark:text-blue-400' 'dark:text-tertiary'
r 'bg-blue-500' 'bg-tertiary'
r 'bg-blue-600' 'bg-tertiary'
r 'border-blue-500' 'border-tertiary'
r 'border-blue-600' 'border-tertiary'
r 'text-purple-500' 'text-tertiary'
r 'text-purple-600' 'text-tertiary'
r 'dark:text-purple-400' 'dark:text-tertiary'
r 'bg-purple-500' 'bg-tertiary'
r 'bg-purple-600' 'bg-tertiary'

echo "🎨 AMBER / RED / TEAL..."
r 'text-amber-500' 'text-destructive'
r 'dark:text-amber-400' 'dark:text-destructive'
r 'bg-amber-500' 'bg-destructive'
r 'bg-amber-400' 'bg-destructive'
r 'text-red-500' 'text-destructive'
r 'dark:text-red-400' 'dark:text-destructive'
r 'bg-red-500' 'bg-destructive'
r 'border-red-500' 'border-destructive'
r 'text-red-400' 'text-destructive'
r 'bg-red-400' 'bg-destructive'
r 'focus:ring-teal-500' 'focus:ring-ring'
r 'text-teal-500' 'text-primary-green'
r 'bg-teal-500' 'bg-primary'

echo "✅ Done. Run: git diff src/ | head -100"
