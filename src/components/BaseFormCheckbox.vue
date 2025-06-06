<template>
  <v-row row-gap="0">
    <!-- 레이블 및 필수 표시 -->
    <v-col class="border-e-thin" sm="2">{{ content.label }}
      <span v-if="content.color" style="color: red;">*</span>
    </v-col>

    <!-- Combobox 형태의 멀티 셀렉트 -->
    <v-col cols="10">
      <v-form ref="formRef">
        <v-combobox
          ref="comboRef"
          v-model="innerValue"
          chips
          :class="{ 'text-required': content.color}"
          clearable
          dense
          density="compact"
          :disabled="content.disabled"
          :item-title="effectiveItemLabel"
          :item-value="effectiveItemValue"
          :items="options"
          :label="content.label"
          multiple
          outlined
          :placeholder="content.placeholder"
          :rules="content.rule"
        />
      </v-form>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue'
  import axios from 'axios'
  import type { VCombobox, VForm } from 'vuetify/components'
  import type { BaseFormFieldProps } from '@/types/components/base-form-field.type';


  type ComboItem = Record<string, unknown>

  // props 정의: content와 v-model, 그리고 선택적 fetchUrl, appendItems, itemLabel, itemValue
  const props = defineProps<{
    content: Omit<BaseFormFieldProps, 'temp'>
    modelValue: unknown[]
    fetchUrl?: string|null
    appendItems?: ComboItem[]
    itemLabel?: string
    itemValue?: string
  }>()

  // v-model emit
  const emit = defineEmits<{ (e: 'update:modelValue', v): void }>()

  // form, combo refs
  const formRef = ref<InstanceType<typeof VForm> | null>(null)
  const comboRef = ref<InstanceType<typeof VCombobox> | null>(null)

  // effective props 우선순위 및 기본값 처리
  const effectiveFetchUrl = computed(() => props.fetchUrl ?? props.content.fetchUrl ?? '')
  const effectiveAppendItems = computed(() => props.appendItems ?? props.content.appendItems ?? [])
  const effectiveItemLabel = computed(() => props.itemLabel ?? props.content.itemLabel ?? 'label')
  const effectiveItemValue = computed(() => props.itemValue ?? props.content.itemValue ?? 'value')

  // 옵션 리스트
  const options = ref<ComboItem[]>([])

  // internal v-model 바인딩
  const innerValue = computed<unknown[]>({
    get: () => props.modelValue ?? [],
    set: v => emit('update:modelValue', v),
  })

  // 옵션 로드 함수
  async function loadOptions () {
    const baseItems: ComboItem[] = Array.isArray(effectiveAppendItems.value)
      ? [...effectiveAppendItems.value]
      : []
    let remote: ComboItem[] = []
    if (effectiveFetchUrl.value) {
      try {
        const res = await axios.get<{ code: string; data: ComboItem[] }>(effectiveFetchUrl.value)
        if (res.data.code === 'SUCCESS' && Array.isArray(res.data.data)) {
          remote = res.data.data
        }
      } catch (err) {
        console.error('BaseFormCheckbox: data load failed', err)
      }
    }
    options.value = [...baseItems, ...remote]
  }

  onMounted(loadOptions)
  watch(effectiveFetchUrl, loadOptions)
  watch(effectiveAppendItems, loadOptions, { deep: true })

  // validate, focus 노출
  function validate () {
    return formRef.value?.validate() ?? false
  }
  function focus () {
    comboRef.value?.focus()
  }
  defineExpose({ validate, focus })
</script>

<style>
.text-required .v-label::after {
  content: '*';
  color: red;
}
</style>
