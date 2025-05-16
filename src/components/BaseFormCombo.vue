<template>
  <v-row row-gap="0">
    <v-col class="border-e-thin" sm="2">
      {{ content.label }}
      <span v-if="content.color" style="color: red;">*</span>
    </v-col>

    <v-col class="pb-0 pt-0" sm="10">
      <v-form ref="formRef">
        <v-select
          ref="selectRef"
          v-model="innerValue"
          :autofocus="content.autofocus"
          :class="{ 'text-required': content.color}"
          :counter="content.counter && content.maxlength || false"
          dense
          density="compact"
          :disabled="content.disabled"
          :item-title="content.itemLabel"
          :item-value="content.itemValue"
          :items="items"
          :label="content.label"
          outlined
          :placeholder="content.placeholder"
          :rules="content.rule"
        />
      </v-form>
    </v-col>
  </v-row>
</template>

  <script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import axios from 'axios'
  import type { VForm, VSelect } from 'vuetify/components'
  import type { BaseFormFieldProps } from '@/types/components/base-form-field.type';

  // props 정의
  const props = defineProps<{
    content: Omit<BaseFormFieldProps, 'temp'>
    modelValue: any
  }>()

  // v-model emit
  const emit = defineEmits<{
    (e: 'update:modelValue', value: any): void
  }>()

  // form & select refs
  const formRef = ref<InstanceType<typeof VForm> | null>(null)
  const selectRef = ref<InstanceType<typeof VSelect> | null>(null)

  // items 저장소
  const items = ref<Array<Record<string, any>>>([])

  // v-model 내부 바인딩
  const innerValue = computed({
    get: () => props.modelValue,
    set: v => emit('update:modelValue', v),
  })

  async function loadItems () {
    const baseItems = Array.isArray(props.content.appendItems)
      ? [...props.content.appendItems]
      : []

    let remote: Array<Record<string, any>> = []
    if (props.content.fetchUrl) {
      try {
        const res = await axios.get<{ code: string; data: Record<string, any>[] }>(
          props.content.fetchUrl
        )
        if (res.data.code === 'SUCCESS' && Array.isArray(res.data.data)) {
          remote = res.data.data
        }
      } catch (err) {
        console.error('BaseFormCombo: data load failed', err)
      }
    }

    items.value = [...baseItems, ...remote]
  }

  onMounted(loadItems)

  // 부모에서 호출할 검증, 포커스 노출
  function validate () {
    return formRef.value?.validate() ?? false
  }
  function focus () {
    selectRef.value?.focus()
  }
  defineExpose({ validate, focus })
  </script>

  <style>
  .text-required .v-label::after {
    content: '*';
    color: red;
  }
  </style>
