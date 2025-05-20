<template>
  <v-card
    class="mb-3"
    outlined
    tile
  >
    <v-card-title class="list-title">
      상세정보
      <v-chip
        v-show="props.model.id == null"
        class="ml-1"

        color="green"
        text-color="white"
        x-small
      >
        NEW
      </v-chip>
    </v-card-title>
    <v-divider />
    <template v-for="(f) in defaultFields" :key="f.key">
      <v-card-subtitle
        class="pa-3 search-title"
      >
        <!-- text, number 둘 다 BaseFormField 로 처리 -->
        <BaseFormField
          v-if="f.type === 'text' || f.type === 'number'"
          ref="fieldRefs"
          v-model:model-value="model[f.key]"
          :content="{...f,text:props.model[f.key]}"
          hide-details
        />

        <!-- combo 타입은 BaseFormCombo 로 처리 -->
        <BaseFormCheckbox
          v-else-if="f.type === 'checkbox'"
          ref="fieldRefs"
          v-model:model-value="model[f.key]"
          :append-items="f.appendItems"
          :content="{...f,text:model[f.key]}"
          :fetch-url="f.fetchUrl"
          hide-details
          :item-label="f.itemLabel"
          :item-value="f.itemValue"
        />

        <!-- combo 타입은 BaseFormCombo 로 처리 -->
        <BaseFormCombo
          v-else-if="f.type === 'combo'"
          ref="fieldRefs"
          v-model:model-value="model[f.key]"
          :append-items="f.appendItems"
          :content="{...f,text:model[f.key]}"
          :fetch-url="f.fetchUrl"
          hide-details
          :item-label="f.itemLabel"
          :item-value="f.itemValue"
        />
        {{ }}

      </v-card-subtitle>

      <v-divider
        class="fill-width"
      />
    </template>
    <v-card-subtitle class="d-flex justify-end ga-3 pb-3">
      <v-btn
        color="primary"
        :text="model.id ? '수정' : '생성' "
        @click.stop.prevent="emit('update', model)"
      />
      <v-btn
        color="error"
        text="삭제"
        @click.stop.prevent="emit('delete', model.id)"
      />
    </v-card-subtitle>
  </v-card>

</template>

<script setup lang="ts">
  import BaseFormField from '@/components/BaseFormField.vue'
  import BaseFormCheckbox from '@/components/BaseFormCheckbox.vue'
  import type { BaseFormFieldProps, MenuAdminDto } from '@/types';
  import BaseFormCombo from '@/components/BaseFormCombo.vue';

  // 1) props 정의: 배열 또는 단일 객체 모두 받기
  const props = defineProps<{
    model: MenuAdminDto
  }>()

  const emit = defineEmits<{
    (e: 'update', model: MenuAdminDto ): void
    (e: 'delete', id: number | string|null): void
  }>()


  // 3) 폼 필드 메타데이터 (기존 defaultFields)
  const defaultFields: Omit<BaseFormFieldProps, 'text' | 'temp'>[] = [
    {
      key: 'name',
      name: '메뉴명',
      label: '메뉴명',
      placeholder: '메뉴명을 입력하세요.',
      disabled: false,
      maxlength: 20,
      counter: true,
      type: 'text',
      autofocus: true,
      color: true,
      message: '메뉴명을 확인해주세요.',
      rule: [
        (v: string) => !!v || '메뉴명은 필수 입력사항입니다.',
        (v: string) => !(v && v.length > 20) || '메뉴명은 20자 이상 입력할 수 없습니다.',
      ],
    },
    {
      key: 'roles',
      name: '메뉴권한',
      label: '메뉴권한',
      placeholder: '메뉴권한을 입력하세요.',
      disabled: false,
      maxlength: null,
      counter: false,
      type: 'checkbox',
      autofocus: false,
      color: true,
      fetchUrl: '/api/constants/roles',
      message: '메뉴권한을 확인해주세요.',
      rule: [(v: string) => v.length!==0 || '메뉴 권한은 필수입니다.'],
    },
    {
      key: 'parentId',
      name: '상위메뉴',
      label: '상위메뉴',
      placeholder: '상위메뉴를 입력하세요.',
      disabled: false,
      maxlength: null,
      counter: false,
      type: 'combo',
      autofocus: false,
      color: true,
      message: '상위메뉴를 확인해주세요.',
      rule: [],
      fetchUrl: '/api/menus?id=all',
      appendItems:[{ id:null,name:'최상위메뉴' }],
      itemLabel:'name',
      itemValue:'id',
    },
    {
      key: 'seq',
      name: '메뉴순서',
      label: '메뉴순서',
      placeholder: '메뉴순서를 입력하세요.',
      disabled: false,
      maxlength: null,
      counter: false,
      type: 'number',
      autofocus: false,
      color: true,
      message: '메뉴순서를 확인해주세요.',
      rule: [
        (v: string) => (v !== undefined && v !== '' && v !== null) || '메뉴순서는 필수 입력사항입니다.',
        (v: string) => /^[0-9\s]*$/.test(v) || '메뉴순서는 숫자만 입력 가능합니다.',
      ],
    },
    {
      key: 'url',
      name: '연결URL',
      label: '연결URL',
      placeholder: '연결URL을 입력하세요.',
      disabled: false,
      maxlength: 100,
      counter: true,
      type: 'text',
      autofocus: false,
      color: false,
      message: '연결URL을 확인해주세요.',
      rule: [
        (v: string) => /^[a-zA-Z0-9/\\s]*$/.test(v) || "연결URL은 영문+숫자+'/'만 입력 가능합니다.",
        (v: string) => !(v && v.length > 100) || '연결URL은 100자 이상 입력할 수 없습니다.',
      ],
    },
    {
      key: 'icon',
      name: '메뉴아이콘',
      label: '메뉴아이콘',
      placeholder: '메뉴아이콘을 입력하세요.',
      disabled: false,
      maxlength: 100,
      counter: true,
      type: 'text',
      autofocus: false,
      color: true,
      message: '메뉴아이콘을 확인해주세요.',
      rule: [
        (v: string) => !!v || '메뉴아이콘은 필수 입력사항입니다.',
        (v: string) => /^[a-z-\s]*$/.test(v) || '메뉴아이콘은 영문(소문자)와 -만 입력 가능합니다.',
        (v: string) => !(v && v.length > 100) || '메뉴아이콘은 100자 이상 입력할 수 없습니다.',
      ],
    },
    {
      key: 'active',
      name: '메뉴사용여부',
      label: '메뉴사용여부',
      placeholder: '메뉴사용여부를 입력하세요.',
      disabled: false,
      maxlength: null,
      counter: false,
      type: 'combo',
      autofocus: false,
      color: true,
      message: '메뉴사용여부를 확인해주세요.',
      rule: [
        (v: { value:string }) => typeof v === 'boolean' || '메뉴사용여부를 선택하세요.',
      ],
      appendItems:[{ label:'예',value:true },{ label:'아니오',value:false }],
      itemLabel:'label',
      itemValue:'value',
    },
    {
      key: 'description',
      name: '메뉴설명',
      label: '메뉴설명',
      placeholder: '메뉴설명을 입력하세요.',
      disabled: false,
      maxlength: 100,
      counter: true,
      type: 'text',
      autofocus: false,
      color: false,
      message: '메뉴설명을 확인해주세요.',
      rule: [
        (v: string) => !(v && v.length > 100) || '메뉴설명은 100자 이상 입력할 수 없습니다.',
      ],
    },
    {
      key: 'prevMenuId',
      name: '이전메뉴',
      label: '이전메뉴',
      placeholder: '이전메뉴를 입력하세요.',
      disabled: false,
      maxlength: null,
      counter: false,
      type: 'combo',
      autofocus: false,
      color: false,
      message: '이전메뉴를 확인해주세요.',
      rule: [],
      fetchUrl: '/api/menus?id=all',
      appendItems:[{ id:null,name:'선택' }],
      itemLabel:'name',
      itemValue:'id',
    },
    {
      key: 'nextMenuId',
      name: '다음메뉴',
      label: '다음메뉴',
      placeholder: '다음메뉴를 입력하세요.',
      disabled: false,
      maxlength: null,
      counter: false,
      type: 'combo',
      autofocus: false,
      color: false,
      message: '다음메뉴를 확인해주세요.',
      rule: [],
      fetchUrl: '/api/menus?id=all',
      appendItems:[{ id:null,name:'선택' }],
      itemLabel:'name',
      itemValue:'id',
    },
  ]
</script>
