<template>
  <v-container class="fill-height fluid pb-1 pt-1 pl-3 pr-3" fluid>
    <v-row class="fill-height">
      <!-- 사이드바: 권한 선택 + 트리 -->
      <v-col cols="3">
        <v-card>
          <v-card-title
            class="d-flex align-center list-title"
            outlined
          >
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
          <IndexTree
            v-model="selectedMenuId"
            :menu-tree="treemodel || []"
            style="height: 670px;"
          />
          <v-divider />
        </v-card>
      </v-col>

      <!-- 상세 정보 -->
      <v-col cols="9">
        <IndexInfo
          v-if="menuDetail"
          :model="menuDetail"
          @update="onUpdate"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { useSearch } from '@/hooks/useSearch'
  import IndexTree from '@/pages/System/menu-management/indexTree.vue'
  import IndexInfo from '@/pages/System/menu-management/indexInfo.vue'
  import type { MenuAdminDto } from '@/types'
  import { useUpdate } from '@/hooks/useUpdate'
  import { useCreate } from '@/hooks/useCreate'
  /**
   * 01. ref 선언
   */
  const isCreating = ref(false)
  const selectedRole = ref<string>('all')
  const selectedMenuId = ref< number | null>(null)

  /**
   * 02. computed 선언
   */
  const iconName = computed(() => isCreating.value ? 'mdi-minus' : 'mdi-plus')
  const buttonLabel= computed(() => isCreating.value ? '취소' : '생성')


  /**
   * 03. CRUD hook 선언
   */
  // 메뉴트리 조회
  const { data:treemodel, fetch:treeSearch } = useSearch<MenuAdminDto[]>('/api/menus');

  // 개별 메뉴 조회
  const { data: menuDetail ,fetch: fetchMenuDetail } = useSearch<MenuAdminDto>('/api/menus')

  const { mutate: updateMenu } = useUpdate<MenuAdminDto>('/api/menus')

  const { mutate: createMenu } = useCreate<MenuAdminDto>('/api/menus')
  /**
   * 04. 생명주기 훅 선언
   */
  onMounted(() => {
    loadTree(selectedRole.value)
  })

  watch(selectedRole, role => {
    loadTree(role)
  })

  watch(selectedMenuId, menuId => {
    if(menuId == -1){
      menuDetail.value=treemodel.value?.find(item=>item.id===-1)
      return
    }
    loadMenuDetail(menuId || '')
  })

  async function loadTree (role: string) {
    await treeSearch({ params: { role } })
  }

  async function loadMenuDetail (menuId: string|number) {
    await fetchMenuDetail({ pathVariable: menuId || '' })
  }

  function toggleCreating (){
    isCreating.value = !isCreating.value
    if(!isCreating.value){
      treemodel.value = treemodel.value?.filter(item=>item.id!==-1)
      return
    }
    const newMenu = {
      id: -1,
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
    treemodel.value?.unshift(newMenu)
    selectedMenuId.value = newMenu.id
  }

  async function onUpdate (menu: MenuAdminDto){
    console.log(menu)
    if(typeof menu.id == 'number' && menu.id>0){
      await updateMenu(menu.id,menu)
    }else{
      await createMenu(menu)
    }
    await loadTree(selectedRole.value)

  }
</script>
