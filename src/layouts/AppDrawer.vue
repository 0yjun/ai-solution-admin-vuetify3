<template>
  <v-navigation-drawer
    v-model="drawerOpen"
    expand-on-hover
    :mini-variant-width="80"
    permanent
    :rail="drawerMini"
    :width="256"
  >
    <v-list
      style="height: 50px; color: white; font-size: 32px;"
    >
      <v-list-item
        class="drawer-logo fill-height d-flex align-center"
        prepend-icon="AI"
        title="AI SOLUTION"
        to="/"
      />
    </v-list>
    <v-divider />
    <v-list dense>
      <template v-for="menuMain in menus" :key="menuMain.name">
        <!-- 자식이 없는 루트메뉴 -->
        <v-list-item
          v-if="!hasChildren(menuMain)"
          :prepend-icon="menuMain.icon"
          :title="menuMain.name"
          :to="menuMain.url"
          :value="menuMain"
        />

        <!-- 자식이 있는 루트메뉴 -->
        <v-list-group v-else :value="menuMain">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              :prepend-icon="menuMain.icon"
              :title="menuMain.name"
            />
          </template>

          <v-list-item
            v-for="(children, i) in menuMain.children"
            :key="i"
            :prepend-icon="children.icon"
            :title="children.name"
            :to="children.url"
            :value="children"
          />
        </v-list-group>


      </template>
    </v-list>

  </v-navigation-drawer>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { useDrawerStore } from '@/stores/drawer';
  import { useMenuStore } from '@/stores';
  import type { MenuClientDto } from '@/types/api/menu.dto';

  const drawerStore = useDrawerStore();
  const { drawerOpen, drawerMini } = storeToRefs(drawerStore);

  const menuStore = useMenuStore();
  const { menus } = storeToRefs(menuStore)

  /** 자식 메뉴 존재 여부 검사 */
  const hasChildren = (menu: MenuClientDto): boolean =>
    Array.isArray(menu.children) && menu.children.length > 0
</script>

<style scoped lang="sass"></style>
