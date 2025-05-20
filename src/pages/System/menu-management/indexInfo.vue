<template>
  <v-card
    class="mb-3"
    outlined
    tile
  >
    <v-card-title class="list-title">
      상세정보
      <v-chip
        v-show="dto.id == null"
        class="ml-1"

        color="green"
        text-color="white"
        x-small
      >
        NEW
      </v-chip>
    </v-card-title>
    <v-divider />
    <template v-for="(f, idx) in fields" :key="f.key">
      <v-card-subtitle
        class="pa-3 search-title"
      >
        <!-- text, number 둘 다 BaseFormField 로 처리 -->
        <BaseFormField
          v-if="f.type === 'text' || f.type === 'number'"
          ref="fieldRefs"
          v-model="fields[idx].text"
          :content="f"
          hide-details
        />

        <!-- combo 타입은 BaseFormCombo 로 처리 -->
        <BaseFormCheckbox
          v-else-if="f.type === 'checkbox'"
          ref="fieldRefs"
          v-model="fields[idx].text"
          :append-items="f.appendItems"
          :content="f"
          :fetch-url="f.fetchUrl"
          hide-details
          :item-label="f.itemLabel"
          :item-value="f.itemValue"
        />

        <!-- combo 타입은 BaseFormCombo 로 처리 -->
        <BaseFormCombo
          v-else-if="f.type === 'combo'"
          ref="fieldRefs"
          v-model="fields[idx].text"
          :append-items="f.appendItems"
          :content="f"
          :fetch-url="f.fetchUrl"
          hide-details
          :item-label="f.itemLabel"
          :item-value="f.itemValue"
        />

      </v-card-subtitle>

      <v-divider
        class="fill-width"
      />
    </template>
    <v-card-subtitle class="d-flex justify-end ga-3 pb-3">
      <v-btn
        color="primary"
        :text="dto.id ? '수정' : '생성' "
        @click.stop.prevent="onSave"
      />
      <v-btn
        color="error"
        text="삭제"
        @click.stop.prevent="()=>{}"
      />
    </v-card-subtitle>
  </v-card>
</template>

<script setup lang="ts">
  import { computed, reactive, ref, watch } from 'vue'
  import BaseFormField from '@/components/BaseFormField.vue'
  import BaseFormCheckbox from '@/components/BaseFormCheckbox.vue'
  import type { BaseFormFieldProps, MenuAdminDto } from '@/types';
  import BaseFormCombo from '@/components/BaseFormCombo.vue';

  // 1) props 정의: 배열 또는 단일 객체 모두 받기
  const props = defineProps<{
    contents: MenuAdminDto | MenuAdminDto[]
  }>()

  // 2) 실제 사용할 DTO 하나만 꺼내는 computed
  const dto = computed<MenuAdminDto>(() =>
    Array.isArray(props.contents)
      ? props.contents[0]
      : props.contents
  )

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

  // 4) dto 값이 바뀔 때마다 fields 배열 재생성
  const fields = reactive<BaseFormFieldProps[]>([])

  watch(dto, newDto => {
    fields.splice(
      0,
      fields.length,
      ...defaultFields.map(f => {
        // DTO 로부터 원시값만 꺼내고, undefined 일 때만 '' 로 대체
        const raw = (newDto as any)[f.key]
        const value = raw === undefined ? '' : raw

        return {
          ...f,
          text: value,
          temp: value,
        }
      })
    )
  }, { immediate: true })

  // 5) 자식 컴포넌트 참조 수집
  type FormComponentInstance =
    | InstanceType<typeof BaseFormField>
    | InstanceType<typeof BaseFormCheckbox>
    | InstanceType<typeof BaseFormCombo>

  const fieldRefs = ref<FormComponentInstance[]>([])

  // 6) 부모가 호출할 수 있는 메서드 노출 (검증·값추출 등)
  const checkAll = async (): Promise<boolean> => {
    for (const comp of fieldRefs.value) {
      // 1) comp.validate() 결과를 받고
      const result = await comp.validate()
      // 2) boolean인지, 객체인지 판별해서 진짜 유효 플래그를 꺼냅니다.
      const isValid = typeof result === 'boolean'
        ? result
        : (result.valid as boolean)

      if (!isValid) {
        const content = comp.$props?.content
        const errorMsg = content?.message || '유효성 검증에 실패했습니다.'
        console.error(errorMsg)
        alert(errorMsg)
        comp.focus()
        return false
      }
    }
    return true
  }

  const getValues = (): Record<string, string> => {
    const result: Record<string, string> = {}
    for (const f of fields) {
      result[f.key] = f.text
    }
    return result
  }

  defineExpose({ checkAll, getValues })

  // 7) 부모로 보낼 이벤트 정의
  const emit = defineEmits<{
    (e: 'save', payload: Record<string, string>): void
  }>()
  async function onSave () {
    // 반드시 await로 검사
    if (!(await checkAll())) {
      console.log('유효성 검사 실패')
      return
    }
    // 유효할 때만 emit
    emit('save', getValues())
  }
</script>
