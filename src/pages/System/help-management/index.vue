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

          </v-card-title>

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
      <v-col

        cols="9"
      >
        <IndexInfo
          v-if="selectedMenuId.length>0"
          :help="helpDetail"
          :menu-id="selectedMenuId[0]"
          @create="onCreate"
          @delete="onDelete"
          @update="onUpdate"
        />
        {{ helpDetail }}
        {{ selectedMenuId }}
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { useSearch } from '@/hooks/useSearch'
  import IndexTree from '@/pages/System/help-management/indexTree.vue'
  import IndexInfo from '@/pages/System/help-management/index-info/indexInfo.vue'
  import type { MenuAdminDto } from '@/types'
  import type { HelpCreateRequestDto, HelpDto } from '@/types/api/help.dto'
  import { useUpdate } from '@/hooks/useUpdate'
  import { useCreate } from '@/hooks/useCreate'
  import { useDelete } from '@/hooks/useDelete'
  /**
   * 01. ref 선언
   */

  const selectedMenuId = ref< number[] >([])

  /**
   * 03. CRUD hook 선언
   */
  // 메뉴트리 조회
  const { data:treemodel, fetch:treeSearch } = useSearch<MenuAdminDto[]>('/api/menus');

  const { data: helpDetail ,fetch: fetchHelpDetail } = useSearch<HelpDto>('/api/helps')

  const { mutate:createeHelp, isSuccess: isCreating, errorMessage: createError } = useCreate<HelpDto>('/api/helps')

  const { mutate:updateHelp, isSuccess: isUpdating, errorMessage: updateError } = useUpdate<HelpDto>('/api/helps')

  const { mutate:deleteHelp, isSuccess: isDeleting, errorMessage: deleteError } = useDelete('/api/helps')

  /**
   * 04. 생명주기 훅 선언
   */
  onMounted(() => {
    loadTree()
  })

  watch(selectedMenuId, menuId => {
    if(menuId.length>0){
      loadMenuDetail(menuId)
    }
  })

  async function loadTree () {
    await treeSearch({ params: { role: 'all' } })
  }

  async function loadMenuDetail (menuId: number[]) {
    await fetchHelpDetail({ params: { menuId:menuId[0] } })
  }

  async function onCreate (help:HelpCreateRequestDto){
    await createeHelp(help);
    if(!isCreating.value){
      alert(createError.value);
    }
    await loadMenuDetail(selectedMenuId.value);
    loadTree()
  }

  async function onUpdate (help:HelpDto){
    await updateHelp(help.helpId, help);
    if(!isUpdating.value){
      alert(updateError.value);
    }
    await loadMenuDetail(selectedMenuId.value);
    loadTree()
  }

  async function onDelete (helpId:number){
    await deleteHelp(helpId);
    if(!isDeleting.value){
      alert(deleteError.value);
    }
    await loadMenuDetail(selectedMenuId.value);
    loadTree()
  }

</script>
