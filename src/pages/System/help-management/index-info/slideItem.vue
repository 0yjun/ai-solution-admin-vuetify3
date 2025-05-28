<!-- src/pages/System/help-manages/index-info/slideItem.vue -->
<template>
  <v-card outlined>
    <v-card-title>
      {{ props.index }}
      <v-chip
        v-show="helpImage.isNew"
        class="ml-1"

        color="green"
        text-color="white"
        x-small
      >
        NEW
      </v-chip>
    </v-card-title>
    <v-card-text>
      <!-- 1행: 이미지 표시 영역 -->
      <v-img
        contain
        max-height="100"
        min-height="100"
        :src="helpImage.previewUrl"
      />

      <!-- 2행: 도움말 이미지 설명 인풋 -->
      <v-text-field
        v-model="helpImage.description"
        dense
        label="이미지 설명"
        outlined
        placeholder="설명을 입력하세요."
      />

      <!-- 3행: 파일 업로드 인풋 -->
      <v-file-input
        v-model="file"
        accept="image/*"
        dense
        label="파일 업로드"
        outlined
        @update:model-value="onFileChange"
      />
    </v-card-text>

    <!-- 액션 영역 -->
    <v-card-actions class="d-flex justify-end ga-3 pb-3">
      <v-btn class="mt-2" color="primary" @click="onSaveClick">저장</v-btn>
      <v-btn class="mt-2" @click="onResetClick">초기화</v-btn>
      <v-btn class="mt-2" color="error" @click="onDeleteClick">삭제</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useHelpStore } from '@/stores/help'
  import type { HelpImageFormModel } from '@/types/api/help.dto'

  // 부모로부터 단일 이미지 모델을 prop으로 전달받음
  const props = defineProps<{
    helpImage: HelpImageFormModel,
    menuId: number,
    helpId: number,
    index: number
  }>()

  // 로컬 복제(ref)하여 양방향 바인딩
  const helpImage = ref<HelpImageFormModel>({ ...props.helpImage })
  watch(() => props.helpImage, v => helpImage.value = { ...v })

  // 파일 업로드용 ref
  const file = ref<File>()

  // Pinia 스토어
  const helpStore = useHelpStore()

  function onFileChange (file: File|File[]) {
    console.log(file)
  }

  // 저장 버튼 클릭
  async function onSaveClick () {
    if (helpImage.value.isNew) {
      // 새 이미지 생성 + 자동 갱신
      await helpStore.createAndRefresh(helpImage.value , props.menuId)
    } else {
      // 기존 이미지 업데이트 + 자동 갱신
      await helpStore.updateAndRefresh(helpImage.value , props.menuId)
    }
  }

  // 초기화 버튼 클릭
  function onResetClick () {
    helpImage.value = { ...props.helpImage }
    file.value = undefined
  }

  // 삭제 버튼 클릭 → emit 체인 대신 스토어 직접 호출
  async function onDeleteClick () {
    if(helpImage.value.isNew){
      helpStore.loadHelp(props.menuId)
    }else{
      await helpStore.deleteImageAndRefresh(
        props.helpId,
        helpImage.value.id,
        props.menuId
      )
    }

  }
</script>
