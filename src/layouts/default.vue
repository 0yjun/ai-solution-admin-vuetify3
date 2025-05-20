<template>
  <AppDrawer />
  <AppBar />
  <AppMain />

  <AppFooter />
  <AppSpinner />
</template>

<script lang="ts" setup>
 // import AppMain from '@/layouts/AppMain.vue';
  import AppDrawer from '@/layouts/AppDrawer.vue';
  import AppBar from '@/layouts/AppBar.vue';
  import AppMain from '@/layouts/AppMain.vue';
  import AppFooter from '@/layouts/AppFooter.vue';
  import AppSpinner from './AppSpinner.vue';
</script>
