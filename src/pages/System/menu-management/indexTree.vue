<template>
  <v-treeview
    :key="treeKey"
    v-model:activated="selectedItem"
    activatable
    item-key="id"
    item-title="name"
    :items="contents"
    open-all
    return-object
  >
    <template #prepend="{ item }">
      <v-icon :icon="item.icon" />
    </template>
  </v-treeview>
  {{ contents }}
</template>

<script setup lang="ts">
  import { defineEmits, defineProps, ref, watch } from 'vue'
  import type { MenuAdminDto } from '@/types/menu.dto'
  import { type PropType } from 'vue'

  const treeKey = ref(0);

  // Props: tree data와 v-model 바인딩을 위한 modelValue
  const props = defineProps({
    contents: {
      type: Array as PropType<MenuAdminDto[]>,
      required: true,
    },
    modelValue: {
      type: Object as PropType<MenuAdminDto | null>,
      default: null,
    },
  })

  // Emit 정의
  const emit = defineEmits<{
    (e: 'update:modelValue', value: MenuAdminDto | null): void
  }>()

  // 선택된 객체 관리
  const selectedItem = ref<MenuAdminDto | null>(props.modelValue)

  // 부모로부터 받은 modelValue가 바뀌면 selectedItem 동기화
  watch(
    () => props.modelValue,
    newVal => {
      selectedItem.value = newVal
    }
  )

  // 트리뷰에서 activated (object) 변경 시 modelValue emit
  watch(
    selectedItem,
    newItem => {
      console.log(newItem)
      treeKey.value++;
      emit('update:modelValue', newItem)
    }
  )
</script>
