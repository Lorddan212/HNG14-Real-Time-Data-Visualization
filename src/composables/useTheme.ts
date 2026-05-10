import { onMounted } from 'vue';
import { useThemeStore } from '@/stores/themeStore';

export function useTheme() {
  const theme = useThemeStore();

  onMounted(() => {
    theme.init();
  });

  return theme;
}
