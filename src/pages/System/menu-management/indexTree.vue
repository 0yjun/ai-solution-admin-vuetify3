<template>
  <!-- 로딩 & 에러 표시 -->
  <v-treeview
    v-if="menuTree"
    v-model:activated="selectedItem"
    activatable
    item-key="id"
    item-title="name"
    item-value="id"
    :items="menuTree"
    select-strategy="trunk"
  >
    <template #prepend="{ item }">
      <v-icon :icon="item.icon" />
    </template>

  </v-treeview>
  {{ selectedItem }}
</template>

<script setup lang="ts">
  import { defineEmits, ref, watch } from 'vue'
  import type { MenuAdminDto } from '@/types'

  // emit 정의
  const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number | null): void
    (e: 'add-placeholder', placeholder: MenuAdminDto): void
    (e: 'remove-placeholder'): void
  }>()

  // props 정의
  interface Props {
    menuTree: MenuAdminDto[]
  }
  const props = defineProps<Props>()

  // 컴포넌트 상태
  const selectedItem = ref<string | number | null>(null)

  // 트리에서 선택된 아이템 변경 시 부모에 전달
  watch(selectedItem, newId => {
    console.log(newId)
    emit('update:modelValue', newId)
  })
</script>
