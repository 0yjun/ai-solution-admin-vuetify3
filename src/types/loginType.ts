export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  code: 'SUCCESS' | string
  message: string
  data: {
    username: string
    role: string
  }| null
}
