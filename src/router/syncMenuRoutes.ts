import { useMenuStore } from '@/stores'
import type { MenuClientDto } from '@/types'


/**
 * 메뉴 트리를 읽어 autoRoutes(폴더라우터)와 매핑한 뒤,
 * route.meta.helpMenuId 등을 주입하거나 addRoute() 호출
 */
export function syncMenuRoutes (router) {
  const menuStore = useMenuStore()
  const menus = menuStore.$state.menus;

  menus.forEach(menu => {
    menu.children?.forEach(child => {
      const target = child.url.toLowerCase()
      router.getRoutes().forEach(r => {
        if (r.path.toLowerCase() === target && r.name) {
          // 한 줄로 덮어쓰기
          r.meta = { ...(r.meta || {}), menuId: child.id }
        }
      })
    })
  })
}
