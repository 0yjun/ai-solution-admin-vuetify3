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
        <!-- 추출된 SlideItem 컴포넌트를 여기에 사용 -->
        {{ helpImage }}
        <SlideItem
          :help-image="helpImage"
          :index="iIdx"
          @delete="onDelete"
        />
      </v-carousel-item>
    </v-carousel>

    <v-divider />
  </v-card>
  <!-- for debug -->
  <pre>editableHelpImages: {{ editableHelpImages }}</pre>
</template>

<script setup lang="ts">
  import { defineProps } from 'vue';
  import type { HelpImageDto, HelpImageFormModel } from '@/types/api/help.dto';
  import SlideItem from '@/pages/System/help-management/index-info/slideItem.vue';
  import { blobToUrl } from '@/utils/blobToUrl';
  import { useDelete } from '@/hooks/useDelete';

  const isCreating = ref(false);

  const props = defineProps<{ helpImages: HelpImageDto[],helpId: number }>();

  const editableHelpImages = ref<HelpImageFormModel[]>([]);

  watch(()=>props.helpImages, imgs=>{
    editableHelpImages.value = imgs.map((v: HelpImageDto)=>({
      ...v,
      file: null,
      previewUrl: blobToUrl(v.blob),
      isNew: false,
    }))
    isCreating.value = false
  })

  const { mutate:deleteHelpImage, isSuccess: isImageDeleting, errorMessage: imaegDeleteError } = useDelete('/api/helps')


  function createEmptyHelpImage () {
    if(editableHelpImages.value.length >3){
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
    editableHelpImages.value.push(newFormImage)
  }

  async function onDelete (idx: number){
    const target = editableHelpImages.value[idx];
    if(!target){
      alert('삭제할 대상이 잘못되었습니다.')
      return;
    }

    if(target.isNew){
      editableHelpImages.value.splice(idx,1)
    }else{
      await deleteHelpImage(`${props.helpId}/images/${target.id}`);
      if(!isImageDeleting){
        alert(imaegDeleteError)
      }
    }
  }

</script>
