import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isLoading: false as boolean,
  }),
  actions: {
    setLoading (val: boolean) {
      this.isLoading = val
    },
  },
})
