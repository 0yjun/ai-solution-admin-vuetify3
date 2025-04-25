import { defineStore } from 'pinia'
import axios from 'axios'
import type { MenuClientDto } from '@/types/menu.dto'
import type { ApiResponseError, ApiResponseSuccess } from '@/types'


export const useMenuStore = defineStore('menu', {
  state: () => ({
    menus: [] as MenuClientDto[], // 사용자에게 보여줄 메뉴 리스트
    isLoading: false, // 로딩 상태
    errorMessage: '', // 에러 메시지
    isLoaded: false, // 한 번이라도 로드했는지 여부
  }),
  actions: {
    async fetchMenu (): Promise<boolean> {
      if (this.isLoaded) return true
      if (this.isLoading) return false

      this.isLoading = true
      this.errorMessage = ''

      try {
        const res = await axios.get<
          ApiResponseSuccess<MenuClientDto[]> | ApiResponseError
        >('/api/menus', {
          withCredentials: true,
        })

        if (res.data.code === 'SUCCESS') {
          this.menus = res.data.data
          this.isLoaded = true
          return true
        } else {
          // code !== SUCCESS
          this.errorMessage = res.data.message || '메뉴 조회에 실패했습니다.'
          return false
        }
      } catch (err: unknown) {
        // 네트워크 에러 등
        let msg = '메뉴 구성에 실패하였습니다.'
        if (axios.isAxiosError<ApiResponseError>(err) && err.response) {
          msg = err.response.data.message
        } else if (err instanceof Error) {
          msg = err.message
        }
        this.errorMessage = msg
        return false
      } finally {
        this.isLoading = false
      }
    },
  },
})
