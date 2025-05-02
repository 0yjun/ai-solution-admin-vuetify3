<template>
  <v-row>
    <!-- 레이블 및 필수 표시 -->
    <v-col cols="2">
      {{ content.label }}
      <span v-if="content.color" style="color: red;">*</span>
    </v-col>

    <!-- 체크박스 그룹 -->
    <v-col cols="10">
      <v-form ref="formRef">
        <v-checkbox-group
          v-model="innerValue"
          row
          :rules="content.rule"
        >
          <v-checkbox
            v-for="item in items"
            :key="item[itemValue]"
            :label="item[itemLabel]"
            :value="item[itemValue]"
          />
        </v-checkbox-group>
      </v-form>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import axios from 'axios'
  import type { VCheckbox, VCheckboxGroup, VForm } from 'vuetify/components'
  import type { FieldDef } from '@/types'

  // 1) Props: FieldDef에서 temp만 뺀 형태, 그리고 v-model용 배열
  const props = defineProps<{
    content: Omit<FieldDef, 'temp'>
    modelValue: string[]
  }>()

  // 2) update:modelValue event 정의
  const emit = defineEmits<{
    (e: 'update:modelValue', v: string[]): void
  }>()

  // 3) form ref (검증용)
  const formRef = ref<InstanceType<typeof VForm> | null>(null)

  // 4) 체크박스 항목 저장소
  const items = ref<Record<string, any>[]>([])

  // 5) v-model 내부 바인딩
  const itemLabel = props.content.itemLabel!
  const itemValue = props.content.itemValue!
  const innerValue = computed<string[]>({
    get: () => props.modelValue || [],
    set: v => emit('update:modelValue', v),
  })

  // 6) API로부터 항목(fetchUrl), 또는 roles일 때 하드코딩된 URL
  async function loadItems () {
    // roles 필드인 경우 고정 URL 사용
    const url =
      props.content.key === 'roles'
        ? '/api/constants/roles'
        : props.content.fetchUrl

    const baseItems = Array.isArray(props.content.appendItems)
      ? [...props.content.appendItems]
      : []

    if (!url) {
      items.value = baseItems
      return
    }

    try {
      const res = await axios.get<{ code: string; data: any[] }>(url)
      if (res.data.code === 'SUCCESS' && Array.isArray(res.data.data)) {
        items.value = [
          ...baseItems,
          ...res.data.data.map((d: any) => ({
            [itemLabel]: d[itemLabel],
            [itemValue]: d[itemValue],
          })),
        ]
      } else {
        console.error('BaseFormCheckbox: data load failed', res.data)
        items.value = baseItems
      }
    } catch (err) {
      console.error('BaseFormCheckbox: load error', err)
      items.value = baseItems
    }
  }
  console

  onMounted(loadItems)

  // 7) validate / focus 노출
  function validate () {
    return formRef.value?.validate() ?? false
  }
  function focus () {
  // 체크박스 그룹에 포커스 기능이 필요하다면 구현
  }
  defineExpose({ validate, focus })
</script>
