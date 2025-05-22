<template>
  <v-card class="mb-4" outlined tile>
    <v-card-title
      class="d-flex align-center list-title"
      outlined
    >
      도움말 상세 정보
      <v-spacer />
      <!-- 생성/취소 토글 버튼 -->
      <v-btn
        v-if="!help && !isCreating"
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
      v-if="!help && !isCreating"
      text="아직 등록된 도움말이 없습니다."
    />

    <!-- 생성 중/편집 폼 -->
    <template
      v-else-if="help"
    >
      <v-card-text
        class="pa-3"
      >
        <v-textarea
          v-model="help.helpDescription"
          auto-grow
          label="도움말 설명"
          outlined
          rows="2"
        />
      </v-card-text>

      <v-card-actions
        class="d-flex justify-end ga-3 pb-3"
      >
        <v-btn
          class="mt-2"
          color="primary"
          @click="onSaveClick"
        >
          저장
        </v-btn>
      </v-card-actions>
    </template>

    <Indexcarousel
      v-if="help"
      :images="help.images"
    />

  </v-card>

</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { type HelpCreateDto, type HelpDto } from '@/types/api/help.dto';
  import Indexcarousel from '@/pages/System/help-management/Indexcarousel.vue';
  import EmptyStateHolder from '@/components/EmptyStateHolder.vue';

  const props = defineProps<{ help: HelpDto | null , menuId: number }>();

  const isCreating = ref(false);

  const help = ref<HelpDto | HelpCreateDto | null>(props.help)

  watch(()=>props.help, value=>{
    help.value = value
    isCreating.value = false
  })

  const emit = defineEmits<{
    (e: 'create', item: HelpCreateDto): void
    (e: 'update', item: HelpDto): void
    (e: 'delete', helpId: number): void
  }>()

  function createEmptyHelp () {
    isCreating.value = true;
    help.value = { menuId: props.menuId, helpDescription: '', images: [] };
  }

  function cancelCreate () {
    isCreating.value = false;
    help.value = null
  }

  function onSaveClick () {
    if(!help.value){
      return;
    }
    if( isCreating.value){
      emit('create', help.value)
    }else {
      emit('update', { ...help.value, menuId: props.menuId })
    }
  }

  function onDeleteClick () {
    if(!help.value || isCreating.value){
      return
    }
    emit('delete',help.value?.helpId)

  }


</script>
