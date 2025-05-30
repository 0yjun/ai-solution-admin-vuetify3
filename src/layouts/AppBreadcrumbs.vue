<template>
  <v-breadcrumbs
    v-if="crumbs.length"
    density="compact"
    :items="crumbs"
  >
    <template #divider>
      <v-icon>mdi-chevron-right</v-icon>
    </template>
  </v-breadcrumbs>
  <v-divider />
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { useMenuStore } from '@/stores/menu'

  const menuStore = useMenuStore()
  const route = useRoute()

  onMounted(() => {
    if (!menuStore.isLoaded) {
      menuStore.fetchClientMenu()
    }
  })

  interface CrumbItem {
    title: string
    to?: string
    disabled: boolean
  }

  // route.path 또는 menus 변경 시점에 crumbs 재계산
  const crumbs = computed<CrumbItem[]>(() => {
    const path = route.path
    const menus = menuStore.menus

    // 1) 최상위 메뉴 match
    const root = menus.find(m => m.url === path)
    if (root) {
      return [{
        disabled: root.url === '',
        title:    root.name,
        to:       root.url,
      }]
    }

    // 2) 자식 메뉴 match
    for (const parent of menus) {
      const child = parent.children?.find(c => c.url === path)
      if (child) {
        return [
          {
            disabled: parent.url === '',
            title:    parent.name,
            to:       parent.url,
          },
          {
            disabled: child.url === '' ,
            title:    child.name,
            to:       child.url,
          },
        ]
      }
    }

    return []
  })
</script>
