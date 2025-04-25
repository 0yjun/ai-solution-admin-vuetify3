// Utilities
import { defineStore } from 'pinia';


export const useDrawerStore = defineStore('drawer', {
  state: () => ({
    /** 사이드 네비게이션 바가 열려 있는지 여부 */
    drawerOpen: true as boolean,
    /** 드로어가 축소된 미니 버전인지 여부 */
    drawerMini: false as boolean,
  }),
  actions: {
    /** 드로어 열림/닫힘 상태를 토글합니다 */
    toggleDrawerOpen () {
      this.drawerOpen = !this.drawerOpen
    },
    /** 드로어 미니 모드(On/Off)를 토글합니다 */
    toggleDrawerMini () {
      this.drawerMini = !this.drawerMini
    },
    /** 드로어 열린 상태를 직접 설정합니다 */
    setDrawerOpen (value: boolean) {
      this.drawerOpen = value
    },
    /** 드로어 미니 모드를 직접 설정합니다 */
    setDrawerMini (value: boolean) {
      this.drawerMini = value
    },
  },
})
