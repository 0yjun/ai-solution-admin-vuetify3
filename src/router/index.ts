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
import { useMenuStore } from '@/stores'
import { syncMenuRoutes } from './syncMenuRoutes'


// vue-router 플러그인을 사용한 디렉토리 기반 라우팅 설정
//  • 기본적으로 모든 경로에 src/layouts/default.vue 레이아웃을 적용
//  • '/login' • '/Signup' 경로는 레이아웃을 비활성화
const routes: RouteRecordRaw[] = autoRoutes.map(route => {
  if (route.path.toLowerCase() === '/login' || route.path.toLowerCase() === '/signup') {
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

let initialized = false;
// 네비게이션 가드 적용
router.beforeEach(async to=>{
  const authStore = useAuthStore()
  const menuStore = useMenuStore()
  if(!initialized){
    initialized = true
    await authStore.fetchMe()
  }

  // 1) 인증 체크
  // 공개 페이지 경로 목록
  const publicPaths = ['/login', '/signup']

  // 로그인 안 된 상태에서, /login, /signup 이외의 경로 접근 시 → /login으로 리다이렉트
  if (!authStore.isAuthenticated && !publicPaths.includes(to.path.toLowerCase())) {
    return { path: '/login' }
  }

  // 2) 로그인 후에도 메뉴가 로드되지 않았다면 재시도
  if (authStore.isAuthenticated && !menuStore.isLoaded && !menuStore.isLoading) {
    await menuStore.fetchClientMenu()
    syncMenuRoutes(router)
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
