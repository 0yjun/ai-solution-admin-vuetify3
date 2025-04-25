import { defineStore } from 'pinia'
import axios from 'axios'
import type { ApiResponse, ApiResponseError, ApiResponseSuccess, LoginRequestDto, MemberDto } from '@/types'


export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false as boolean,
    user: null as MemberDto | null,
    errorMessage: '' as string,
    isLoading: false as boolean, // ← 로그인 중 로딩 상태
  }),
  actions: {
    /**
     * 로그인 시도
     * @returns 성공하면 true, 실패하면 false
     */
    async login (credentials: LoginRequestDto): Promise<boolean> {
      this.isLoading = true
      this.errorMessage = ''

      try {
        const { data: resp } = await axios.post<
          ApiResponseSuccess<MemberDto> | ApiResponseError
        >('/api/auth/login', credentials, { withCredentials: true })

        if (resp.code !== 'SUCCESS') {
          this.errorMessage = resp.message
          this.isAuthenticated = false
          this.user = null
          return false
        }

        this.user = resp.data
        this.isAuthenticated = true
        return true

      } catch (err: unknown) {
        let msg = '로그인에 실패하였습니다.'
        if (axios.isAxiosError<ApiResponseError>(err) && err.response) {
          msg = err.response.data.message
        } else if (err instanceof Error) {
          msg = err.message
        }
        this.errorMessage = msg
        this.isAuthenticated = false
        this.user = null
        return false

      } finally {
        this.isLoading = false
      }
    },

    async fetchMe (): Promise<boolean> {
      this.isLoading = true
      this.errorMessage = ''

      try {
        // 1) JWT 쿠키가 있으면 자동 포함됨
        const res = await axios.get<ApiResponse<MemberDto>>(
          '/api/members/me',
          { withCredentials: true }
        )

        console.log(res)
        const body = res.data

        // 2) business 실패 코드 처리
        if (body.code !== 'SUCCESS') {
          this.isAuthenticated = false
          this.user = null
          this.errorMessage = body.message
          return false
        }

        // 3) 성공 시 state 업데이트
        this.user = body.data
        this.isAuthenticated = true
        return true

      } catch (err: unknown) {
        // 4) 네트워크/서버 에러 처리
        let msg = '내 정보 조회에 실패했습니다.'
        if (axios.isAxiosError<ApiResponseError>(err) && err.response) {
          msg = err.response.data.message
        } else if (err instanceof Error) {
          msg = err.message
        }
        this.errorMessage = msg
        this.isAuthenticated = false
        this.user = null
        return false

      } finally {
        // 5) 항상 로딩 해제
        this.isLoading = false
        console.log(this.isAuthenticated)
      }
    },
  },
})
