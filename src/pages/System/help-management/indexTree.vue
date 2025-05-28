<template>
  <v-treeview
    v-if="props.menuTree"
    activatable
    item-key="name"
    item-title="name"
    item-value="id"
    :items="props.menuTree"
    select-strategy="leaf"
    style="height: 670px;"
    @update:activated="(e)=>emit('select-node',e)"
  >
    <template #prepend="{ item }">
      <v-icon :icon="item.icon" />
    </template>
  </v-treeview>
</template>

<script setup lang="ts">
  import { defineEmits, defineProps } from 'vue'
  import type { MenuAdminDto } from '@/types'

  // Props 정의: v-model로 전달되는 modelValue와 메뉴 트리
  const props = defineProps<{ menuTree: MenuAdminDto[] }>()

  // Emit 정의: update:modelValue 이벤트 외에 placeholder 이벤트
  const emit = defineEmits<{
    (e: 'select-node', value: unknown): void
  }>()

</script>
