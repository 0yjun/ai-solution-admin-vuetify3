<template>
  <v-skeleton-loader
    v-if="helpStore.$state.isFetchLoading || isMenuLoading"
    :loading="helpStore.$state.isFetchLoading || isMenuLoading"
    type="card"
  />
  <v-card
    v-else
    class="mb-4"
    outlined
    tile
  >
    <v-card-title class="d-flex align-center list-title" outlined>
      [{{ menu && menu.name }}] 도움말 상세 정보
      <v-spacer />

      <!-- 생성/취소/삭제 토글 버튼 -->
      <v-btn
        v-if="!helpDetailLocal && !localCreating"
        small
        @click="createEmptyHelp"
      >
        <v-icon left>mdi-plus</v-icon>
        도움말 추가
      </v-btn>
      <v-btn
        v-else-if="localCreating"
        small
        @click="cancelCreate"
      >
        <v-icon left>mdi-cancel</v-icon>
        생성 취소
      </v-btn>
      <v-btn
        v-else
        color="error"
        small
        @click="onDeleteClick"
      >
        <v-icon left>mdi-delete</v-icon>
        삭제
      </v-btn>
    </v-card-title>

    <v-divider />

    <!-- 빈 상태 안내 -->
    <EmptyStateHolder
      v-if="!helpDetailLocal && !localCreating"
      text="아직 등록된 도움말이 없습니다."
    />

    <!-- 상세 폼 -->
    <template v-else-if="helpDetailLocal">
      <v-card-text class="pa-3">
        <v-textarea
          v-model="helpDetailLocal.helpDescription"
          auto-grow
          label="도움말 설명"
          outlined
          rows="2"
        />
      </v-card-text>

      <v-card-actions class="d-flex justify-end ga-3 pb-3">
        <v-btn class="mt-2" color="primary" @click="onSaveClick">
          저장
        </v-btn>
      </v-card-actions>
    </template>

    <v-devider />
    <!-- 이미지 관리: 생성 모드가 아닐 때만 -->
    <ImageInfo
      v-if="helpDetailLocal?.images && !localCreating"
      :help-id="(helpDetailLocal as HelpDto).helpId"
      :help-images="(helpDetailLocal as HelpDto).images"
      :menu-id="props.menuId"
    />
  </v-card>

</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useHelpStore } from '@/stores/help'
  import EmptyStateHolder from '@/components/EmptyStateHolder.vue'
  import ImageInfo from '@/pages/System/help-management/index-info/imageInfo.vue'
  import type { HelpCreateRequestDto, HelpDto } from '@/types/api/help.dto'
  import type { MenuAdminDto } from '@/types'
  import { useSearch } from '@/hooks/useSearch'

  // props: 상위 index.vue에서 menuDetail, menuId만 넘겨줌
  const props = defineProps<{
    menuId: number
  }>()

  const { data:menu, fetch: fetchMenu, isLoading: isMenuLoading } = useSearch<MenuAdminDto>('/api/menus');

  // Pinia store
  const helpStore = useHelpStore()

  // 로컬 UI 모드: 생성 모드 토글
  const localCreating = ref(false)

  // 편집 중인 도움말(생성 혹은 기존 데이터)
  const helpDetailLocal = ref<HelpDto | HelpCreateRequestDto | null>(null)

  // 메뉴 변경 시 기존 상태 초기화 및 fetch
  watch(
    () => props.menuId,
    async menuId => {
      localCreating.value = false
      await helpStore.loadHelp(menuId)
      helpDetailLocal.value = helpStore.help

      await fetchMenu({ pathVariable: menuId })
    },
    { immediate: true }
  )

  // store.help 변경 시 로컬 데이터 동기화
  watch(
    () => helpStore.help,
    data => {
      console.log(data)
      if (!localCreating.value) {
        helpDetailLocal.value = data
      }
    }
  )

  // 생성 폼 모드 전환
  function createEmptyHelp () {
    localCreating.value = true
    helpDetailLocal.value = {
      helpDescription: '',
      menuId: props.menuId,
      images: [],
    }
  }

  // 생성 취소 → 기존 데이터 복원
  function cancelCreate () {
    localCreating.value = false
    helpDetailLocal.value = helpStore.help
  }

  // 저장: 생성 vs 수정 분기하여 스토어 호출
  async function onSaveClick () {
    if (!helpDetailLocal.value) return
    if (localCreating.value) {
      await helpStore.createAndRefresh(
        helpDetailLocal.value as HelpCreateRequestDto,
        props.menuId
      )
      localCreating.value = false
    } else {
      await helpStore.updateAndRefresh(
        helpDetailLocal.value as HelpDto,
        props.menuId
      )
    }
  }

  // 삭제: 단일 호출로 삭제 및 재조회
  async function onDeleteClick () {
    if (!helpDetailLocal.value || localCreating.value) return
    await helpStore.deleteAndRefresh(
      (helpDetailLocal.value as HelpDto).helpId,
      props.menuId
    )
  }
</script>
