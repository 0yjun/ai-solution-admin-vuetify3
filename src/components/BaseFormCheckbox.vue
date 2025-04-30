<template>
  <v-row v-bind="attrs">
    <v-col cols="2">{{ content.label }}</v-col>
    <v-col cols="10">
      <v-form ref="formRef">
        <v-select
          ref="selectRef"
          v-model="innerValue"
          :autofocus="content.autofocus"
          :class="{ 'text-required': content.color }"
          dense
          :disabled="content.disabled"
          :item-title="itemLabel"
          :item-value="itemValue"
          :items="items"
          :label="content.label"
          outlined
          :placeholder="content.placeholder"
          :rules="content.rule"
        />
      </v-form>
      {{ innerValue }}
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, useAttrs, watch } from 'vue'
  import axios from 'axios'
  import type { ApiResponse, FieldDef, MenuAdminDto } from '@/types'
  import type { VForm } from 'vuetify/components'
  import type { VSelect } from 'vuetify/components'

  // Props 정의
  const props = defineProps<{
    content: Omit<FieldDef, 'temp'>
    modelValue: unknown
    fetchUrl?: string|null
    fetchParams?: Record<string, string>
    appendItems?: Record<string, string>[]
    itemLabel?: string
    itemValue?: string
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', v: any): void
  }>()

  // 부모로부터 받은 class/style 등을 v-row에 전달
  const attrs = useAttrs()

  // refs for form & select
  const formRef = ref<VForm|null>(null)
  const selectRef = ref<VSelect|null>(null)

  // 완전 제어형 컴포넌트(v-model)
  const innerValue = computed({
    get:  () => props.modelValue,
    set: v => emit('update:modelValue', v),
  })

  watch(innerValue,newvalue=>console.log(newvalue))

  // 콤보 박스 아이템 목록
  const items = ref<Record<string, any>[]>([])
  const prefix = props.appendItems ?? []

  async function loadItems () {
    if (props.fetchUrl) {
      try {
        const res = await axios.get<ApiResponse<MenuAdminDto>>(props.fetchUrl, {
          params: props.fetchParams,
        })
        if(res.data.code==='SUCCESS'){
          const resData = res.data.data
          items.value = [...prefix, ...resData]
        }
      } catch (e) {
        console.error('BaseFormCombo loadItems failed', e)
        items.value = [...prefix]
      }
    } else {
      items.value = [...prefix]
    }
  }

  // 마운트 시, 그리고 fetchUrl/params/appendItems 변경 시 재로딩
  onMounted(loadItems)
  watch(
    () => [props.fetchUrl, props.fetchParams, props.appendItems],
    loadItems,
    { deep: true }
  )

  // 외부에서 호출 가능한 메서드들
  function validate () {
    return formRef.value?.validate() ?? false
  }
  function focus () {
    selectRef.value?.focus()
  }
  function getValue () {
    return innerValue.value
  }
  function setValue (v: any) {
    emit('update:modelValue', v)
  }

  defineExpose({ validate, focus, getValue, setValue })

  // 기본 itemLabel/itemValue
  const itemLabel = props.itemLabel || 'label'
  const itemValue = props.itemValue || 'value'
</script>
