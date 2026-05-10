import { defineStore } from 'pinia';

type ThemeMode = 'light' | 'dark';

function getPreferredTheme(): ThemeMode {
  const stored = localStorage.getItem('operations-theme');
  if (stored === 'dark' || stored === 'light') {
    return stored;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export const useThemeStore = defineStore('theme', {
  state: () => ({
    mode: 'light' as ThemeMode,
  }),
  getters: {
    isDark: (state) => state.mode === 'dark',
  },
  actions: {
    init() {
      this.mode = getPreferredTheme();
      this.applyTheme();
    },
    setMode(mode: ThemeMode) {
      this.mode = mode;
      localStorage.setItem('operations-theme', mode);
      this.applyTheme();
    },
    toggle() {
      this.setMode(this.mode === 'dark' ? 'light' : 'dark');
    },
    applyTheme() {
      document.documentElement.dataset.theme = this.mode;
      document.documentElement.style.colorScheme = this.mode;
    },
  },
});
