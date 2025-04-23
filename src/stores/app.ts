// Utilities
import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', () => {
  const drawer = ref(false);

  function toggleDrawer () {
    drawer.value = !drawer.value;
  }
  return { drawer, toggleDrawer };
});
