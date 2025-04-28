<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      <span class="font-weight-black flex-grow-1">메뉴</span>

      <v-tooltip :text="buttonLabel">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            :aria-label="buttonLabel"
            icon
            @click="toggleCreating"
          >
            <v-icon>{{ iconName }}</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </v-card-title>
    <!-- v-card-text 작성 예정 -->
  </v-card>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'

  const isCreating = ref(false)
  const iconName = computed(() => (isCreating.value ? 'mdi-minus' : 'mdi-plus'))
  const buttonLabel = computed(() => (isCreating.value ? '취소' : '생성'))

  function toggleCreating (): void {
    isCreating.value = !isCreating.value
  }
</script>
