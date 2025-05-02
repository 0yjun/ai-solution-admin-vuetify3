<template>
  <v-container class="fill-height" fluid>
    <v-row class="fill-height">
      <!-- 사이드바: 권한 선택 + 트리 -->
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
            ref="roleRef"
            v-model="selectedRole"
            :append-items="[{ value: 'all', label: '전체' }]"
            fetch-url="/api/constants/roles"
            item-label="label"
            item-value="value"
            label="권한등급"
          />

          <v-divider />

          <!-- 메뉴 트리 (로딩/에러/Tree 뷰 내부 처리) -->
          <IndexTree
            ref="treeRef"
            v-model="selectedMenu"
          />
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
  import type { ApiResponse } from '@/types'
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
  async function saveMenu (payload: Record<string, string>) {
    if (!selectedMenu.value) return
    console.log(saveMenu)
    const isNew = selectedMenu.value.id == null
    const url = isNew
      ? '/api/menus'
      : `/api/menus/${selectedMenu.value.id}`

    try {
      // POST 혹은 PUT 메서드 선택
      const method = isNew ? 'post' : 'put'
      const res = await (axios)[method]<ApiResponse<MenuAdminDto>>(url, payload)

      if (res.data.code === 'SUCCESS' && res.data.data) {
        // 저장 성공: 트리 재로드, 상세 선택 갱신
        await treeRef.value?.load(selectedRole.value)
        selectedMenu.value = res.data.data
      } else {
        // 저장 실패: 콘솔에 오류 메시지 출력
        console.error('저장 실패:', res.data.message)
      }
    } catch (err) {
      // 네트워크 혹은 예외 발생 시 콘솔에 출력
      console.error('저장 중 오류 발생:', err)
    }
  }
</script>
