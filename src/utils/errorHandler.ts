import type { ApiResponseError } from '@/types'
import axios from 'axios'

export function handleApiError (
  store: { $reset(): void, errorMessage: string },err: unknown,defaultMsg: string):boolean{
  let msg = defaultMsg
  if(axios.isAxiosError<ApiResponseError>(err) && err.response){
    msg = err.response.data.message
  }else if(err instanceof Error){
    msg = err.message
  }
  store.$reset()
  store.errorMessage = msg
  return false
}
