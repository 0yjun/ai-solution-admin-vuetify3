/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes as autoRoutes } from 'vue-router/auto-routes'
import { useAuthStore } from '@/stores/auth'


// vue-router 플러그인을 사용한 디렉토리 기반 라우팅 설정
//  • 기본적으로 모든 경로에 src/layouts/default.vue 레이아웃을 적용
//  • '/login' 경로는 레이아웃을 비활성화
const routes: RouteRecordRaw[] = autoRoutes.map(route => {
  if (route.path.toLowerCase() === '/login') {
    return {
      ...route,
      meta: {
        ...(route.meta || {}),
        layout: false,
      },
    }
  }
  return route
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

// 네비게이션 가드 적용
router.beforeEach(async to=>{
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated;
  await authStore.fetchMe()
  console.log('isAuthenticated',isAuthenticated)
  if(!isAuthenticated && to.name !=='/Login/'){
    return { name:'/Login/' }
  }
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
