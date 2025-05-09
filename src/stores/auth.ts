import { defineStore } from 'pinia'
import axios from 'axios'
import type { ApiResponse, ApiResponseError, ApiResponseSuccess, LoginRequestDto, MemberDto } from '@/types'
import { handleApiError } from '@/utils/errorHandler'
import type { SignupRequestDto } from '@/types/signup-request.dto'


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
        return handleApiError(this,err,'로그인에 실패했습니다.')
      } finally {
        this.isLoading = false
      }
    },

    /**
     * 회원가입 시도
     * @returns 성공하면 true, 실패하면 false
     */
    async signup (payload: SignupRequestDto): Promise<boolean> {
      this.isLoading = true
      this.errorMessage = ''

      try {
        const { data: resp } = await axios.post<
          ApiResponseSuccess<MemberDto> | ApiResponseError
        >('/api/auth/signup', payload, { withCredentials: true })

        if (resp.code !== 'SUCCESS') {
          this.errorMessage = resp.message
          return false
        }
        return true

      } catch (err: unknown) {
        console.log(err)
        return handleApiError(this, err, '회원가입에 실패했습니다.')
      } finally {
        this.isLoading = false
      }
    },
    /**
     * 로그아웃
     * @returns 성공하면 true, 실패하면 false
     */
    async logout (): Promise<boolean>{
      this.isLoading = true
      this.errorMessage = ''
      try {
        await axios.post('/api/auth/logout',{},{ withCredentials: true })
        this.isAuthenticated = false
        this.user= null
        return true
      } catch (err: unknown) {
        return handleApiError(this,err,'로그아웃에 실패했습니다.')
      }finally{
        this.isLoading = false
      }

    },
    /**
    * HttpOnly 쿠키에 저장된 인증 토큰으로 현재 사용자 정보를 조회한다.
    * - 조회 성공 시 `user`와 `isAuthenticated`를 업데이트하고 `true`를 반환한다
    * - 조회 실패 시 `user`와 인증 상태를 초기화하고 `false`를 반환한다
    * @returns {Promise<boolean>} 요청 성공 여부
    */
    async fetchMe (): Promise<boolean> {
      this.isLoading = true
      this.errorMessage = ''

      try {
        // 1) JWT 쿠키가 있으면 자동 포함됨
        const res = await axios.get<ApiResponse<MemberDto>>(
          '/api/members/me',
          { withCredentials: true }
        )

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
        return handleApiError(this,err,'내 정보 조회에 실패했습니다.')
      } finally {
        // 5) 항상 로딩 해제
        this.isLoading = false
      }
    },
  },
})
