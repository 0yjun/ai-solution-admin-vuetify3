<template>
  <v-select
    v-model="internalValue"
    :density="density"
    :disabled="disabled"
    :hide-details="hideDetail"
    :item-title="itemLabel"
    :item-value="itemValue"
    :items="items"
    :label="label"
    outlined
  />
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import axios from 'axios'
  import { toRefs } from 'vue'
  import type { ApiResponse } from '@/types'
  import type { Density } from 'vuetify/lib/composables/density.mjs'
  type comboItemType = Record<string, unknown>

  const props = defineProps({
    fetchUrl:    { type: String, default:'' },
    fetchParams: { type: Object, default: () => ({}) },
    disabled:    { type: Boolean, default: false },
    hideDetail:  { type: Boolean, default: false },
    label:       { type: String, default: '' },
    itemValue:   { type: String, default: 'value' },
    itemLabel:   { type: String, default: 'text' },
    required:    { type: Boolean, default: false },
    modelValue:  { required: false },
    density:     { type: String as PropType<Density>, default: 'compact' }, // 'default' | 'comfortable' | 'compact'
    appendItems: { type: Array as PropType<comboItemType[]>, default: () => [] },

  })
  onMounted(loadItems)

  const emit = defineEmits(['update:modelValue'])

  // 부모 modelValue → 내부 ref 동기화
  const internalValue = ref(props.modelValue)

  //
  watch(internalValue, v => emit('update:modelValue', v))

  watch(() => props.modelValue, v => internalValue.value = v)

  const { fetchUrl, fetchParams,appendItems } = toRefs(props)

  const items:Ref<comboItemType[]>= ref([])

  async function loadItems () {
    // 1) 부모가 준 appendItems
    const prefix = [...appendItems.value]

    // 2) 원격에서 받아올 데이터
    let remote: comboItemType[] = []

    if (fetchUrl.value) {
      try {
        const res = await axios.get<ApiResponse<comboItemType[]>>(fetchUrl.value, {
          params: fetchParams.value,
        })
        if (res.data.code === 'SUCCESS') {
          remote = res.data.data
        }
      } catch (e) {
        console.error('ComboBox 데이터 로드 실패', e)
      // remote는 빈 배열 채워둠
      }
    }

    // 3) 항상 appendItems를 앞에 붙여서 최종 items 세팅
    items.value = [...prefix, ...remote]
  }

</script>

<style>
.text-required .v-label::after {
  content: '*';
  color: red;
}
</style>
