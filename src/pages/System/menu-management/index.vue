<template>
  <v-container class="fill-height" fluid>
    <v-row class="fill-height">
      <v-col class="d-flex flex-column" cols="3">
        <v-card class="flex-grow-1">
          <v-card-title class="d-flex align-center" outlined>
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
          <v-divider />

          <!-- 권한 선택 -->
          <Combo
            v-model="selectedRole"
            :append-items="[{ value: 'all', label: '전체' }]"
            fetch-url="/api/constants/roles"
            item-label="label"
            item-value="value"
            label="권한등급"
          />

          <v-divider />

          <!-- 로딩 상태 -->
          <v-progress-circular
            v-if="isLoading"
            class="ma-auto"
            indeterminate
            size="24"
          />

          <!-- 에러 상태 -->
          <v-alert v-if="errorMsg" dense type="error">
            {{ errorMsg }}
          </v-alert>

          <!-- 메뉴 트리 -->
          <IndexTree
            v-model="selectedMenu"
            :contents="menuTree"
            item-value="value"
          />
        </v-card>
      </v-col>

      <!-- 상세 정보 영역 -->
      <v-col cols="9">
        <IndexInfo
          v-if="selectedMenu"
          :contents="selectedMenu"
          style="height: min-content; overflow-y: auto;"
        />
      </v-col>
    </v-row>

  </v-container>

</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import type { ApiResponse } from '@/types'
  import type { MenuAdminDto } from '@/types/menu.dto'
  import IndexTree from '@/pages/System/menu-management/indexTree.vue'
  import IndexInfo from '@/pages/System/menu-management/indexInfo.vue'
  import Combo from '@/components/Combo.vue'
  import axios from 'axios'

  // 상태 정의
  const isCreating = ref(false)
  const menuTree = ref<MenuAdminDto[]>([])
  const selectedRole = ref<string>('')
  const selectedMenu = ref<MenuAdminDto | null>(null)
  const isLoading = ref(false)
  const errorMsg = ref('')

  // 버튼 UI
  const iconName = computed(() => (isCreating.value ? 'mdi-minus' : 'mdi-plus'))
  const buttonLabel = computed(() => (isCreating.value ? '취소' : '생성'))

  // Placeholder 추가/제거
  function addPlaceholder () {
    if (!menuTree.value.some(item => item.id === null)) {
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
      };

      menuTree.value.unshift(placeholder);
      selectedMenu.value = placeholder;
    }
  }

  function removePlaceholder () {
    menuTree.value = menuTree.value.filter(item => item.id !== null)
    if (selectedMenu.value?.id === null) {
      selectedMenu.value = null
    }
  }

  // 생성 토글 핸들러
  function toggleCreating (): void {
    isCreating.value = !isCreating.value
    if (isCreating.value) addPlaceholder()
    else removePlaceholder()
  }

  // 메뉴 트리 로드
  async function loadMenuTree (role: string) {

    if (!role) {
      menuTree.value = []
      return
    }

    isLoading.value = true
    errorMsg.value = ''
    try {
      const response = await axios.get<ApiResponse<MenuAdminDto[]>>(
        `/api/menus/${role}`,
      )

      if (response.data.code === 'SUCCESS' && Array.isArray(response.data.data)) {
        menuTree.value = response.data.data
      } else {
        errorMsg.value = response.data.message || '메뉴 조회 실패'
        menuTree.value = []
      }
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.error(err)
        errorMsg.value = '메뉴 API 호출 오류'
        menuTree.value = []
      }
    } finally {
      isLoading.value = false
    }
  }

  // 권한 변경 시 상태 초기화 및 로드
  watch(
    selectedRole,
    role => {
      isCreating.value = false
      selectedMenu.value = null
      loadMenuTree(role)
    },
    { immediate: true }
  )

  // 메뉴 선택 시 상세 로직
  watch(selectedMenu, menu => {
    if (menu && menu.id !== null) {
      console.log('선택된 메뉴:', menu)
    // TODO: 상세 API 호출 등
    }
  })
</script>
