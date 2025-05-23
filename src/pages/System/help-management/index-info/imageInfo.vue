<template>
  <v-card class="mb-4 pa-5" outlined>
    <v-card-title class="d-flex align-center list-title">
      이미지 관리 ({{ formHelpImages.length }}/3)
      <v-spacer />
      <v-btn
        v-if="!isCreating"
        :disabled="formHelpImages.length >= 3 || isUploading"
        small
        @click="createEmptyHelpImage"
      >
        <v-icon left>mdi-camera-plus</v-icon>
        이미지 추가
      </v-btn>
    </v-card-title>

    <!-- Carousel wrapper -->
    <v-carousel
      v-if="formHelpImages.length"
      height="400"
      hide-delimiter-background
      show-arrows
    >
      <v-carousel-item
        v-for="(helpImage, iIdx) in formHelpImages"
        :key="iIdx"
      >
        <!-- 추출된 SlideItem 컴포넌트를 여기에 사용 -->
        {{ helpImage }}
        <SlideItem
          :help-image="helpImage"
          :index="iIdx"
        />
      </v-carousel-item>
    </v-carousel>

    <v-divider />
  </v-card>
  <!-- for debug -->
  <pre>formHelpImages: {{ formHelpImages }}</pre>
</template>

<script setup lang="ts">
  import { defineProps } from 'vue';
  import type { HelpImageDto, HelpImageFormModel } from '@/types/api/help.dto';
  import SlideItem from '@/pages/System/help-management/index-info/SlideItem.vue';
  import { blobToUrl } from '@/utils/blobToUrl';

  const isCreating = ref(false);

  const props = defineProps<{
    images: HelpImageDto[]| [];
    isUploading: boolean;
  }>();


  const formHelpImages = ref<HelpImageFormModel[]>([])

  watch(()=>props.images, imgs=>{
    formHelpImages.value = imgs.map((v: HelpImageDto)=>({
      ...v,
      file: null,
      previewUrl: blobToUrl(v.blob),
      isNew: false,
    }))
    isCreating.value = false
  })

  function createEmptyHelpImage () {
    if(formHelpImages.value.length >3){
      return;
    }
    if(isCreating.value){
      return;
    }
    isCreating.value = true;
    const newFormImage:HelpImageFormModel = {
      blob: '',
      file: null,
      description: '',
      previewUrl: '',
      isNew: true,
    }
    formHelpImages.value.push(newFormImage)
  }

</script>
