/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins';

// Components
import App from './App.vue';

// Composables
import { createApp } from 'vue';

// Pinia
import { createPinia } from 'pinia';

const pinia = createPinia();

const app = createApp(App);
app.use(pinia);

registerPlugins(app);

// scss
import '@/styles/global.scss'
import '@/styles/table.scss'

// Axios 인터셉터 설정
const loadingStore = useLoadingStore()

axios.interceptors.request.use(config => {
  const method = config.method?.toLowerCase()
  if (method === 'post' || method === 'put' || method === 'delete') {
    loadingStore.setLoading(true)
  }
  return config
})

import { useAuthStore } from './stores';
const authStore = useAuthStore()
axios.interceptors.response.use(
  response => {
    const method = response.config.method?.toLowerCase()
    if (method === 'post' || method === 'put' || method === 'delete') {
      loadingStore.setLoading(false)
    }
    return response
  },
  error=> {
    const method = error?.config?.method?.toLowerCase()
    if (method === 'post' || method === 'put' || method === 'delete') {
      loadingStore.setLoading(false)
    }

    const errorResponse:ApiResponseError = error.response.data;
    console.log(error)
    if(errorResponse.code==='JWT002' || errorResponse.code ==='JWT001'){
      alert(errorResponse.message || '토큰이 만료되었습니다.')
      authStore.$reset()
      router.push('/Login')

    }

    return Promise.reject(error)
  }
)


// 로드시 menuId 구성
import { useMenuStore } from './stores';
import router from './router';

const menuStore = useMenuStore();
await menuStore.fetchClientMenu();
syncMenuRoutes(router)

// 새로고침시 JWT로 세션 유지
import axios from 'axios';
import { useLoadingStore } from './stores/loading';
import { syncMenuRoutes } from './router/syncMenuRoutes';
import type { ApiResponse, ApiResponseError } from './types';

if(!authStore.isAuthenticated){
  try {
    await authStore.fetchMe()
    console.log(`fetchMe 완료, isAuthenticated=${authStore.isAuthenticated}`)
  } catch (e) {
    console.error('세션 확인 실패', e)
  }
}

app.mount('#app');
