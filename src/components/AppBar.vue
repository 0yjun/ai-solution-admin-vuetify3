<template>
  <v-app-bar :elevation="2">
    <template #prepend>
      <v-app-bar-nav-icon @click="toggleDrawer" />
    </template>
    <v-app-bar-title>AI Solution Management</v-app-bar-title>
  </v-app-bar>
</template>

<script setup lang="ts">
  import { useAppStore } from '@/stores/app';
  const appStore = useAppStore();
  const { toggleDrawer } = appStore;
</script>

<style scoped lang="sass"></style>
