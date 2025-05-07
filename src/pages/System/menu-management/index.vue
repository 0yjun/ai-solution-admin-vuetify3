<template>
  <v-container class="fill-height fluid pb-0 pt-0 pl-3 pr-3" fluid>
    <v-row class="fill-height">
      <!-- 사이드바: 권한 선택 + 트리 -->
      <v-col cols="3">
        <v-card class="fill-height d-flex flex-column">
          <v-card-title class="d-flex align-center list-title" outlined>
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
          <div
            class="pa-3"
          >
            <Combo
              ref="roleRef"
              v-model="selectedRole"
              :append-items="[{ value: 'all', label: '전체' }]"
              fetch-url="/api/constants/roles"
              hide-detail
              item-label="label"
              item-value="value"
              label="권한등급"
            />
          </div>
          <v-divider />

          <!-- 메뉴 트리 (로딩/에러/Tree 뷰 내부 처리) -->
          <div class="flex-grow-1">
            <IndexTree
              ref="treeRef"
              v-model="selectedMenu"
            />
          </div>
        </v-card>
      </v-col>

      <!-- 상세 정보 -->
      <v-col cols="9">
        <IndexInfo
          v-if="selectedMenu"
          :contents="selectedMenu"
          style="height: min-content; overflow-y: auto;"
          @save="saveMenu"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import type { MenuAdminDto } from '@/types/menu.dto'
  import Combo from '@/components/Combo.vue'
  import IndexTree from '@/pages/System/menu-management/indexTree.vue'
  import IndexInfo from '@/pages/System/menu-management/indexInfo.vue'
  import type { ApiResponse, ApiResponseError } from '@/types'
  import axios from 'axios'

  // 상태
  const isCreating = ref(false)
  const selectedRole = ref<string>('')
  const selectedMenu = ref<MenuAdminDto | null>(null)
  const treeRef = ref<InstanceType<typeof IndexTree>>()
  const roleRef = ref<InstanceType<typeof Combo>>()
  // 토글 버튼 UI
  const iconName = computed(() => isCreating.value ? 'mdi-minus' : 'mdi-plus')
  const buttonLabel= computed(() => isCreating.value ? '취소' : '생성')


  onMounted(() => {
    treeRef.value?.load('all')
  })


  function toggleCreating () {
    isCreating.value = !isCreating.value
    if (isCreating.value) {
      treeRef.value?.addPlaceholder()
    } else {
      treeRef.value?.removePlaceholder()
    }
  }

  // 권한 변경 시 트리 컴포넌트에 로드 요청
  watch(
    selectedRole,
    role => {
      isCreating.value = false
      selectedMenu.value = null
      treeRef.value?.load(role)
    },
    { immediate: true }
  )

  // 메뉴 선택 시 상세 처리
  watch(
    selectedMenu,
    menu => {
      if (menu && menu.id !== null) {
        console.log('선택된 메뉴:', menu)
      // TODO: IndexInfo API 호출 등 추가 처리
      }
    }
  )
  // 메뉴 저장
  async function saveMenu (payload: Record<string,string>) {
    // 1) 메뉴가 선택되지 않았다면 중단
    if (!selectedMenu.value) {
      console.warn('저장할 메뉴가 선택되지 않았습니다.');
      return;
    }

    // 2) roles 배열내에 { value: string } 형태가 있으면 string으로 추출
    payload.roles = payload.roles.map(role => {
      if (role && typeof role === 'object' && 'value' in role) {
        return role.value;
      }
      return role;
    });

    // 3) selectedMenu가 배열이면 첫 번째 요소, 아니면 단일 객체
    const menuItem = Array.isArray(selectedMenu.value)
      ? selectedMenu.value[0]
      : selectedMenu.value;

    const menuId = menuItem.id;
    const isUpdate = Number.isInteger(menuId);

    // 4) HTTP 메서드와 URL 결정
    const method = isUpdate ? 'put' : 'post';
    const url = isUpdate ? `/api/menus/${menuId}` : '/api/menus';

    try {
      // 5) Axios 호출
      const response = await axios[method]<ApiResponse<MenuAdminDto>>(url, payload);
      if(response.data.code === 'SUCCESS'){
        await treeRef.value?.load(selectedRole.value);
        selectedMenu.value = response.data.data;
        alert(response.data.message)
      }
    } catch (err) {
      let errorMessage = ''
      if(axios.isAxiosError<ApiResponseError>(err) && err.response){
        errorMessage = err.response.data.message
      }else if(err instanceof Error){
        errorMessage = err.message
      }
      alert(errorMessage)
    }
  }
</script>
