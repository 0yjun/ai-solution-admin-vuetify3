<template>
  <v-card class="mb-4 pa-5" outlined>
    <v-card-title class="d-flex align-center list-title">
      이미지 관리 ({{ editableHelpImages.length }}/3)
      <v-spacer />
      <v-btn
        v-if="!isCreating"
        :disabled="editableHelpImages.length >= 3"
        small
        @click="createEmptyHelpImage"
      >
        <v-icon left>mdi-camera-plus</v-icon>
        이미지 추가
      </v-btn>
    </v-card-title>

    <!-- Carousel wrapper -->
    <v-carousel
      v-if="editableHelpImages.length"
      height="400"
      hide-delimiter-background
      show-arrows
    >
      <v-carousel-item
        v-for="(helpImage, iIdx) in editableHelpImages"
        :key="iIdx"
      >
        <!-- SlideItem 컴포넌트에서 직접 스토어 호출 -->
        <SlideItem
          :help-id="props.helpId"
          :help-image="helpImage"
          :index="iIdx"
          :menu-id="props.menuId"
        />
      </v-carousel-item>
    </v-carousel>

    <v-divider />
  </v-card>
  <!-- for debug -->
  <pre>editableHelpImages: {{ editableHelpImages }}</pre>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import SlideItem from '@/pages/System/help-management/index-info/slideItem.vue'
  import type { HelpImageDto, HelpImageFormModel } from '@/types/api/help.dto'
  import { blobToUrl } from '@/utils/blobToUrl'

  // props로 helpImages와 menuId, helpId를 전달받습니다.
  const props = defineProps<{ helpImages: HelpImageDto[]; helpId: number; menuId: number }>()

  const isCreating = ref(false)
  const editableHelpImages = ref<HelpImageFormModel[]>([])

  // 부모로부터 받은 helpImages를 로컬 폼 모델로 매핑
  watch(
    () => props.helpImages,
    imgs => {
      editableHelpImages.value = imgs.map(v => ({
        ...v,
        file: null,
        previewUrl: blobToUrl(v.blob),
        isNew: false,
      }))
      isCreating.value = false
    },
    { immediate: true }
  )

  function createEmptyHelpImage () {
    if (editableHelpImages.value.length >= 3 || isCreating.value) return
    isCreating.value = true
    const newFormImage: HelpImageFormModel = {
      blob: '',
      description: '',
      isNew: true,
    }
    editableHelpImages.value.push(newFormImage)
  }
</script>
