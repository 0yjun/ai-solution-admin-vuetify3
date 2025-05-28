<template>
  <v-container class="fill-height fluid pb-1 pt-1 pl-3 pr-3" fluid>
    <v-row class="fill-height">
      <!-- 사이드바: 권한 선택 + 트리 -->
      <v-col cols="3">
        <v-card>
          <v-card-title class="d-flex align-center list-title" outlined>
            <span class="font-weight-black flex-grow-1">메뉴</span>
          </v-card-title>
          <v-divider />
          <IndexTree
            :menu-tree="treemodel || []"
            style="height: 670px;"
            @select-node="onTreeNodeChange"
          />
          <v-divider />
        </v-card>
      </v-col>

      <!-- 상세 정보 -->
      <v-col cols="9">
        <IndexInfo
          v-if="selectedMenuId"
          :menu-id="selectedMenuId"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import IndexTree from '@/pages/System/help-management/indexTree.vue'
  import IndexInfo from '@/pages/System/help-management/index-info/indexInfo.vue'
  import type { MenuAdminDto } from '@/types'
  import { useSearch } from '@/hooks/useSearch'

  // --- 메뉴 트리 & 상세 (기존 그대로) ---
  const selectedMenuId = ref<number>()
  const { data: treemodel, fetch: treeSearch } = useSearch<MenuAdminDto[]>('/api/menus')

  // 1) 초기 로드
  onMounted(() => {
    treeSearch({ params: { role: 'all' } })
  })

  function onTreeNodeChange (e){
    if(Array.isArray(e)){
      selectedMenuId.value = e[0]
    }else{
      selectedMenuId.value = e
    }

  }
</script>
