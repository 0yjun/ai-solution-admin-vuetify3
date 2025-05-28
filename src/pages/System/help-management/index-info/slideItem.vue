<template>
  <v-card
    class="d-flex flex-column"
    outlined
  >
    <v-card-text>
      <!-- 1행: 이미지 표시 영역 -->
      <v-img
        class="pb-2"
        cover
        height="180"
        :src="previewUrl"
      />

      <!-- 2행: 도움말 이미지 설명 인풋 -->
      <v-text-field
        v-model="helpImage.imageDescription"
        dense
        label="이미지 설명"
        outlined
        placeholder="설명을 입력하세요."
      />

      <!-- 3행: 파일 업로드 인풋 -->
      <v-file-input
        v-model="localFile"
        accept="image/*"
        dense
        label="파일 업로드"
        outlined
        @update:model-value="(e)=>onFileChange(Array.isArray(e) ? e[0]: e)"
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
  import type { HelpImageFormModel, HelpImageUpdateRequestDto } from '@/types/api/help.dto'

  // 부모로부터 단일 이미지 모델을 prop으로 전달받음
  const props = defineProps<{
    helpImage: HelpImageFormModel,
    menuId: number,
    helpId: number,
  }>()

  // 로컬 복제(ref)하여 양방향 바인딩
  const helpImage = ref<HelpImageFormModel>({ ...props.helpImage })
  watch(() => props.helpImage, v => {
    helpImage.value = { ...v }
    previewUrl.value = v.url
  })

  // 파일 업로드용 ref
  const localFile = ref<File>()

  const previewUrl = ref<string | ArrayBuffer | null | undefined>(props.helpImage.url || '')
  // Pinia 스토어
  const helpStore = useHelpStore()

  function onFileChange (file: File) {
    const reader = new FileReader();
    reader.onload = ({ target })=>{
      previewUrl.value = target?.result;
    }
    reader.readAsDataURL(file)
    //localFile.value = file
  }

  // 저장 버튼 클릭
  async function onSaveClick () {
    if(!localFile.value){
      alert('파일이 선택되지 않았습니다.')
      return;
    }
    if (helpImage.value.isNew) {
      // 새 이미지 생성 + 자동 갱신
      //const helpImageCreateRequestDto: HelpImageCreateRequestDto = { ...helpImage.value , file: localFile.value }
      const form = new FormData();
      form.append('imageDescription', helpImage.value.imageDescription);
      form.append('file', localFile.value)
      await helpStore.createhelpImageAndRefresh(form, props.helpId, props.menuId)
    } else {
      console.log('update')
      // 기존 이미지 업데이트 + 자동 갱신
      // const helpImageUpdateRequestDto: HelpImageUpdateRequestDto = { ...helpImage.value , file: localFile.value }
      // await helpStore.updateAndRefresh(helpImageUpdateRequestDto , props.menuId)
      const form = new FormData();
      form.append('imageDescription', helpImage.value.imageDescription);
      form.append('file', localFile.value)
      await helpStore.updatehelpImageAndRefresh(form, props.helpId, helpImage.value.id, props.menuId)
    }
  }

  // 초기화 버튼 클릭
  function onResetClick () {
    previewUrl.value = helpImage.value.url
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
