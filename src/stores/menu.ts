import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'
import axios from 'axios'

// 필요에 따라 경로를 프로젝트에 맞게 수정하세요
import type { MenuClientDto } from '@/types'
import type { ApiResponseError, ApiResponseSuccess } from '@/types'

export const useMenuStore = defineStore('menu', {
  state: () => ({
    menus: [] as MenuClientDto[], // 전체 메뉴 리스트
    isLoading: false, // 로딩 중 상태
    isLoaded: false, // 한 번이라도 로드했는지 여부
    errorMessage: '', // 에러 메시지
  }),

  getters: {
    /**
     * 현재 경로(route.path)에 맞는 breadcrumbs 반환
     * - [root] 혹은 [parent, child] 형태
     * - 없으면 빈 배열
     */
    breadcrumbs (state): Array<{ id: number; name: string; url: string }> {
      const route = useRoute()
      const path = route.path

      // 1) 최상위 메뉴에서 직접 match
      const root = state.menus.find(m => m.url === path)
      if (root) {
        return [{ id: root.id, name: root.name, url: root.url }]
      }

      // 2) 자식 메뉴 중 match 되는 항목 찾기
      for (const parent of state.menus) {
        const child = parent.children?.find(c => c.url === path)
        if (child) {
          return [
            { id: parent.id, name: parent.name, url: parent.url },
            { id: child.id, name: child.name, url: child.url },
          ]
        }
      }

      // 3) 못 찾으면 빈 배열
      return []
    },
  },
  actions: {
    /**
     * 메뉴 API에서 메뉴 리스트를 fetch
     * 이미 로드됐으면 바로 true, 로딩 중이면 false 반환
     */
    async fetchClientMenu (): Promise<boolean> {
      if (this.isLoaded) return true
      if (this.isLoading) return false

      this.isLoading = true
      this.errorMessage = ''

      try {
        const res = await axios.get<
          ApiResponseSuccess<MenuClientDto[]> | ApiResponseError
        >('/api/menus', { withCredentials: true })

        if (res.data.code === 'SUCCESS') {
          this.menus = res.data.data
          this.isLoaded = true
          return true
        } else {
          this.errorMessage = res.data.message || '메뉴 조회에 실패했습니다.'
          return false
        }
      } catch (err: unknown) {
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
