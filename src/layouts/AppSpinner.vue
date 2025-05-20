<template>
  <v-overlay
    class="align-center justify-center"
    :model-value="loading"
  >
    <v-progress-circular
      color="primary"
      indeterminate
      size="64"
    />
  </v-overlay>
</template>

<script setup lang="ts">
  import { useLoadingStore } from '@/stores/loading';

  const loadingStore = useLoadingStore()
  const loading = computed(() => loadingStore.isLoading)


</script>
