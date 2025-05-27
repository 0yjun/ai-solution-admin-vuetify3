<template>
  <v-card class="mb-4" outlined tile>
    <v-card-title class="d-flex align-center list-title" outlined>
      도움말 상세 정보
      <v-spacer />

      <!-- 생성/취소 토글 버튼 -->
      <v-btn
        v-if="!helpDetail && !isCreating"
        small
        @click="createEmptyHelp"
      >
        <v-icon left>mdi-plus</v-icon>
        도움말 추가
      </v-btn>
      <v-btn
        v-else-if="isCreating"
        small
        @click="cancelCreate"
      >
        <v-icon left>mdi-cancel</v-icon>
        생성 취소
      </v-btn>
      <!-- 삭제 버튼 -->
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
      v-if="!helpDetail && !isCreating"
      text="아직 등록된 도움말이 없습니다."
    />

    <!-- 생성 중/편집 폼 -->
    <template v-else-if="helpDetail">
      <v-card-text class="pa-3">
        <v-textarea
          v-model="helpDetail.helpDescription"
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

    <!-- 이미지 관리: 생성 모드일 때만 보여줌 -->
    <ImageInfo
      v-if="helpDetail?.images && !isCreating"
      :help-id="props.helpDetail?.helpId"
      :help-images="helpDetail.images"
      :menu-id="props.menuId"
    />
  </v-card>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import type { HelpCreateRequestDto, HelpDto } from '@/types/api/help.dto';
  import EmptyStateHolder from '@/components/EmptyStateHolder.vue';
  import ImageInfo from '@/pages/System/help-management/index-info/imageInfo.vue';

  // 1) props 이름을 helpDetail로 통일
  const props = defineProps<{
    helpDetail: HelpDto;
    menuId: number;
  }>();

  const emit = defineEmits<{
    (e: 'create', item: HelpCreateRequestDto): void;
    (e: 'update', item: HelpDto): void;
    (e: 'delete', helpId: number): void;
  }>();

  const isCreating = ref(false);

  // 2) 로컬 상태도 helpDetail로
  const helpDetail = ref<HelpDto | HelpCreateRequestDto | null>(props.helpDetail);

  // props 변경 감지
  watch(
    () => props.helpDetail,
    value => {
      helpDetail.value = value;
      isCreating.value = false;
    }
  );

  // 새 도움말 시작
  function createEmptyHelp () {
    isCreating.value = true;
    // HelpCreateRequestDto 타입에 맞춰서 생성
    helpDetail.value = {
      helpDescription: '',
      menuId: props.menuId,
      images: [],
    };
  }

  // 생성 취소
  function cancelCreate () {
    isCreating.value = false;
    helpDetail.value = null;
  }

  // 저장 (create vs update 분기)
  function onSaveClick () {
    if (!helpDetail.value) return;

    if (isCreating.value) {
      // 타입 단언으로 HelpCreateRequestDto로 넘김
      emit('create', helpDetail.value as HelpCreateRequestDto);
    } else {
      // update 시엔 기존 HelpDto 형태
      emit('update', helpDetail.value as HelpDto);
    }
  }

  // 삭제
  function onDeleteClick () {
    if (!helpDetail.value || isCreating.value) return;
    emit('delete', (helpDetail.value as HelpDto).helpId);
  }
</script>
