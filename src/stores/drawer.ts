// Utilities
import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    drawer: false,
  }),
  actions: {
    toggleDrawer () {
      console.log(this.drawer);
      this.drawer = !this.drawer;
    },
    openDrawer () {
      this.drawer = true;
    },
    clsoeDrawer () {
      this.drawer = false;
    },
  },
});
