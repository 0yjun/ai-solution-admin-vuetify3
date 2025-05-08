<template>
  <v-select
    :class="{ 'text-required': required }"
    dense
    :disabled="disabled"
    hide-details
    :item-title="'label'"
    :item-value="'value'"
    :items="items"
    :label="label"
    outlined
    :value="modelValue"
    @update:model-value="(v) => $emit('update:modelValue', v)"
  />
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import axios from 'axios'
  import { toRefs } from 'vue'
  import type { ApiResponse } from '@/types'
  type comboItemType = Record<string, string>

  const props = defineProps({
    fetchUrl:    { type: String, default:'' },
    fetchParams: { type: Object, default: () => ({}) },
    disabled:    { type: Boolean, default: false },
    label:       { type: String, default: '' },
    itemValue:   { type: String, default: 'value' },
    itemLabel:   { type: String, default: 'text' },
    required:    { type: Boolean, default: false },
    modelValue:  { required: false },
    appendItems: { type: Array as PropType<comboItemType[]>, default: () => [] },

  })

  const { fetchUrl, fetchParams,appendItems } = toRefs(props)
  const items:Ref<comboItemType[]>= ref([])

  const emit = defineEmits(['update:modelValue'])

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
    emit('update:modelValue',items.value[0]?.value)
  }

  onMounted(loadItems)

  watch(fetchParams, loadItems, { deep: true })


</script>

<style>
.text-required .v-label::after {
  content: '*';
  color: red;
}
</style>
