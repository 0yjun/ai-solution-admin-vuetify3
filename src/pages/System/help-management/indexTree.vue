<template>
  <v-treeview
    v-if="menuTree"
    v-model:activated="selectedItem"
    activatable
    item-key="name"
    item-title="name"
    item-value="id"
    :items="menuTree"
    select-strategy="trunk"
    style="height: 670px;"
  >
    <template #prepend="{ item }">
      <v-icon :icon="item.icon" />
    </template>
  </v-treeview>
  {{ selectedItem }}
</template>

<script setup lang="ts">
  import { defineEmits, defineProps, ref, watch } from 'vue'
  import type { MenuAdminDto } from '@/types'

  // Props 정의: v-model로 전달되는 modelValue와 메뉴 트리
  interface Props {
    modelValue: number[] | []
    menuTree: MenuAdminDto[] | []
  }
  const props = defineProps<Props>()

  // Emit 정의: update:modelValue 이벤트 외에 placeholder 이벤트
  const emit = defineEmits<{
    (e: 'update:modelValue', value: number[]| []): void
  }>()

  // 내부 상태: 부모로부터 받은 modelValue로 초기화
  const selectedItem = ref<number[] | []>(props.modelValue)

  // selectedItem이 변경되면 부모에 update:modelValue 이벤트 전파
  watch(selectedItem, newId => {
    console.log(newId)
    emit('update:modelValue',newId)
  })
</script>
