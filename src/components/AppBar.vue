<template>
  <v-app-bar app elevation="2" title="AI Solution Management">
    <template #prepend>
      <!-- 데스크탑: 미니 토글 -->
      <v-app-bar-nav-icon class="hidden-sm-and-down" @click="onDrawerMiniClick">
        <v-icon>
          {{ drawerMini ? 'mdi-dots-vertical' : 'mdi-format-list-bulleted' }}
        </v-icon>
      </v-app-bar-nav-icon>

      <!-- 모바일: 오픈/클로즈 토글 -->
      <v-app-bar-nav-icon class="hidden-md-and-up" @click="onDrawerClick">
        <v-icon>
          {{ drawerOpen ? 'mdi-dots-vertical' : 'mdi-format-list-bulleted' }}
        </v-icon>
      </v-app-bar-nav-icon>

      <v-spacer />
    </template>

    <template #append>
      {{ username }}
      <v-btn icon="mdi-theme-light-dark" title="toggle theme" @click="toggleTheme" />
      <v-avatar color="surface-variant">
        <span class="text-h5">{{ authStore.username }}</span>
      </v-avatar>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
  import { useDrawerStore } from '@/stores/drawer'
  import { useAuthStore } from '@/stores'
  import { storeToRefs } from 'pinia'
  import { useTheme } from 'vuetify'
  const drawerStore = useDrawerStore()
  const { drawerOpen, drawerMini } = storeToRefs(drawerStore)
  const theme = useTheme()
  const authStore = useAuthStore();
  const { username } = storeToRefs(authStore)

  //데스크탑: 미니 토글
  function onDrawerMiniClick () {
    drawerStore.setDrawerOpen(true)
    drawerStore.toggleDrawerMini()
  }

  // 모바일: 오픈/클로즈 토글
  function onDrawerClick () {
    drawerStore.setDrawerMini(true)
    drawerStore.toggleDrawerOpen()
  }

  //테마 변경
  function toggleTheme () {
    theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  }

</script>

<style scoped lang="sass"></style>
