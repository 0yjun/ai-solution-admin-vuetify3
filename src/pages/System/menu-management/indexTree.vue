<template>
  <div>
    <!-- 로딩 & 에러 표시 -->
    <v-progress-circular v-if="loading" class="ma-auto" indeterminate size="24" />
    <v-alert v-else-if="errorMsg" dense type="error">{{ errorMsg }}</v-alert>

    <!-- 트리 뷰 -->
    <v-treeview
      v-else
      v-model:activated="selectedItem"
      activatable
      item-key="id"
      item-title="name"
      :items="menuTree"
      open-all
      return-object
    >
      <template #prepend="{ item }">
        <v-icon :icon="item.icon" />
      </template>
    </v-treeview>
  </div>
</template>

<script setup lang="ts">
  import { defineEmits, defineExpose, ref, watch } from 'vue'
  import axios from 'axios'
  import type { ApiResponse, MenuAdminDto } from '@/types/menu.dto'

  // emit 정의
  const emit = defineEmits<{
    (e: 'update:modelValue', value: MenuAdminDto | null): void
  }>()

  // 컴포넌트 상태
  const menuTree = ref<MenuAdminDto[]>([])
  const selectedItem = ref<MenuAdminDto | null>(null)
  const loading = ref(false)
  const errorMsg = ref('')

  // API 기본 경로
  const API_BASE = '/api/menus'

  /**
   * 메뉴 트리를 로드합니다.
   * @param role 권한 문자열
   */
  async function load (role: string) {
    console.log('load tree')
    loading.value = true
    errorMsg.value = ''
    menuTree.value = []
    selectedItem.value = null

    if (!role) {
      loading.value = false
      return
    }

    try {
      const res = await axios.get<ApiResponse<MenuAdminDto[]>>(
        `${API_BASE}/${role}`
      )
      if (res.data.code === 'SUCCESS' && Array.isArray(res.data.data)) {
        menuTree.value = res.data.data
      } else {
        errorMsg.value = res.data.message || '메뉴 조회 실패'
      }
    } catch (e) {
      console.error(e)
      errorMsg.value = '메뉴 API 호출 오류'
    } finally {
      loading.value = false
    }
  }

  /**
   * 새 메뉴(placeholder) 추가
   */
  function addPlaceholder () {
    const placeholder: MenuAdminDto = {
      id: null,
      name: '새 메뉴',
      description: '',
      url: '',
      seq: 0,
      icon: '',
      active: false,
      parentId: null,
      children: [],
      roles: [],
      prevMenuId: null,
      prevMenuUrl: null,
      prevMenuName: null,
      nextMenuId: null,
      nextMenuUrl: null,
      nextMenuName: null,
    }
    menuTree.value.unshift(placeholder)
    selectedItem.value = placeholder
  }

  /**
   * placeholder 제거
   */
  function removePlaceholder () {
    menuTree.value = menuTree.value.filter(item => item.id !== null)
    if (selectedItem.value?.id === null) {
      selectedItem.value = null
    }
  }

  // 부모 컴포넌트에서 호출 가능하도록 메서드 노출
  defineExpose({ load, addPlaceholder, removePlaceholder })

  // 트리에서 선택된 아이템 변경 시 부모에 전달
  watch(selectedItem, newItem => {
    emit('update:modelValue', newItem)
  })
</script>
