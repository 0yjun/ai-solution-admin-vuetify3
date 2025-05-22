<template>
  <v-card class="mb-4 pa-5" outlined>
    <v-card-title
      class="d-flex align-center list-title"
    >
      이미지 관리 ({{ images.length }}/3)
      <v-spacer />
      <v-btn
        :disabled="images.length >= 3 || isUploading"
        small
        @click="onAddSlot"
      >
        <v-icon left>mdi-camera-plus</v-icon>
        이미지 추가
      </v-btn>
    </v-card-title>

    <v-divider />

    <v-card-text>
      <v-carousel
        v-if="images.length"
        height="200"
        hide-delimiters
        show-arrows-on-hover
      >
        <v-carousel-item
          v-for="(img, idx) in images"
          :key="img.seq"
        >
          <div class="pa-4 d-flex flex-column align-center">
            <v-img
              contain
              height="120"
              :src="img.previewUrl || img.blob"
            />

          </div>
          <v-text-field
            v-model="img.description"
            class="mt-2"
            dense
            hide-details
            label="이미지 설명"
            @change="onDescriptionChange(idx, img.description)"
          />
          <div class="mt-2 d-flex">
            <v-btn icon small @click="() => $emit('upload', idx)">
              <v-icon>mdi-upload</v-icon>
            </v-btn>
            <v-btn icon small @click="() => $emit('remove', idx)">
              <v-icon color="error">mdi-delete</v-icon>
            </v-btn>
            <v-btn icon small @click="() => $emit('reset', idx)">
              <v-icon>mdi-backup-restore</v-icon>
            </v-btn>
          </div>
        </v-carousel-item>
      </v-carousel>

      <div v-else class="text-center py-8 text-body-2">
        이미지가 없습니다.
      </div>
    </v-card-text>
  </v-card>
  {{ images }}
</template>

<script setup lang="ts">
  import { defineEmits, defineProps } from 'vue';
  import type { HelpImageDto } from '@/types/api/help.dto';

  const props = defineProps<{
    images: HelpImageDto[];
    isUploading: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'add'): void;
    (e: 'upload', index: number): void;
    (e: 'remove', index: number): void;
    (e: 'reset', index: number): void;
    (e: 'updateDescription', payload: { index: number; description: string }): void;
  }>();

  function onAddSlot () {
    emit('add');
  }

  function onDescriptionChange (index: number, description: string) {
    emit('updateDescription', { index, description });
  }
</script>

<style scoped>
.pa-4 { padding: 16px; }
</style>
