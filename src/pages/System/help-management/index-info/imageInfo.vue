<template>
  <v-card class="mb-4 pa-5" outlined>
    <v-card-title class="d-flex align-center list-title">
      도움말 이미지
      <span
        v-if="editableHelpImages.length>0"
      >
        [{{ currentHelpImageIndex+1 }} / {{ editableHelpImages.length }} ]
      </span>

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
      v-model="currentHelpImageIndex"
      hide-delimiter-background
      mandatory="force"
      show-arrows
    >

      currentHelpImageIndex:{{ currentHelpImageIndex }}
      <v-carousel-item
        v-for="(helpImage, iIdx) in editableHelpImages"
        :key="iIdx"
      >
        <!-- SlideItem 컴포넌트에서 직접 스토어 호출 -->
        <SlideItem
          :help-id="props.helpId"
          :help-image="helpImage"
          :menu-id="props.menuId"
        />
      </v-carousel-item>
    </v-carousel>

    <v-divider />
  </v-card>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import SlideItem from '@/pages/System/help-management/index-info/slideItem.vue'
  import type { HelpImageDto, HelpImageFormModel } from '@/types/api/help.dto'

  // props로 helpImages와 menuId, helpId를 전달받습니다.
  const props = defineProps<{ helpImages: HelpImageDto[]; helpId: number; menuId: number }>()

  const isCreating = ref(false)
  const editableHelpImages = ref<HelpImageFormModel[]>([])

  const currentHelpImageIndex = ref<number>(0)
  const currentHelpImage = ref<HelpImageFormModel>()

  watch(currentHelpImageIndex,
        index=>{
          currentHelpImage.value = editableHelpImages[index]
        }
  )

  // 부모로부터 받은 helpImages를 로컬 폼 모델로 매핑
  watch(
    () => props.helpImages,
    imgs => {
      editableHelpImages.value = imgs.map(v => ({
        ...v,
        file: null,
        isNew: false,
      }))
      isCreating.value = false
      currentHelpImageIndex.value = imgs.length - 1
    },
    { immediate: true }
  )

  function createEmptyHelpImage () {
    if (editableHelpImages.value.length >= 3 || isCreating.value) return
    isCreating.value = true
    const newFormImage: HelpImageFormModel = {
      imageDescription: '',
      isNew: true,
    }
    editableHelpImages.value.push(newFormImage)

    currentHelpImageIndex.value = editableHelpImages.value.length -1
  }
</script>
