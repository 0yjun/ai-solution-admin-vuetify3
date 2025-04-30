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
</script>
