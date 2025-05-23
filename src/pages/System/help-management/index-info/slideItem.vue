<!-- SlideItem.vue -->
<template>
  <v-card outlined>
    <v-card-text>
      <!-- 1행: 이미지 표시 영역 -->
      <v-img
        contain
        max-height="100"
        min-height="100"
        :src="helpImageModal.previewUrl"
      />

      <!-- 2행: 도움말 이미지 설명 인풋 -->
      <v-text-field
        v-model="helpImageModal.description"
        dense
        label="이미지 설명"
        outlined
        placeholder="설명을 입력하세요."
      />

      <!-- 3행: 파일 업로드 인풋 -->
      <v-file-input
        v-model="helpImageModal.file"
        accept="image/*"
        dense
        label="파일 업로드"
        outlined
        @change="onFileChange"
      />
    </v-card-text>

    <!-- 액션 영역 -->
    <v-card-actions
      class="d-flex justify-end ga-3 pb-3"
    >
      <v-btn class="mt-2" color="primary" @click="onSaveClick">저장</v-btn>
      <v-btn class="mt-2" text @click="onResetClick">초기화</v-btn>
      <v-btn class="mt-2" color="error" text @click="onRemoveClick">삭제</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
  import type { HelpImageFormModel } from '@/types/api/help.dto'

  // 부모로부터 주입받는 단일 이미지 모델
  const props = defineProps<{ helpImage: HelpImageFormModel , index: number }>()

  const helpImageModal = ref<HelpImageFormModel>(props.helpImage)

  watch(()=>props.helpImage, value=>{
    helpImageModal.value = value
  })
</script>
