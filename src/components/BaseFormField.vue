<template>
  <v-row>
    <v-col class="border-e-thin" sm="2">
      {{ content.label }}
      <span
        v-if="content.color"
        style="color: red;"
      >
        *
      </span>
    </v-col>

    <v-col sm="10">
      <v-form ref="formRef">
        <v-text-field
          ref="inputRef"
          v-model="innerValue"
          :autofocus="content.autofocus"
          :class="{ 'text-required': content.color }"
          :counter="content.counter && content.maxlength || false"
          dense
          density="compact"
          :disabled="content.disabled"
          :label="content.label"
          outlined
          :placeholder="content.placeholder"
          :rules="content.rule"
          :type="content.type"
        />
      </v-form>
    </v-col>
  </v-row>
</template>

  <script setup lang="ts">
  import { computed, nextTick, onMounted, ref } from 'vue'
  import type { FieldDef } from '@/types'
  import type { VForm, VTextField } from 'vuetify/components';

  const props = defineProps<{
    content: Omit<FieldDef, 'temp'>
    modelValue: string
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', v: string): void
  }>()

  // form, input ref
  const formRef = ref<InstanceType<typeof VForm> | null>(null)
  const inputRef = ref<InstanceType<typeof VTextField> | null>(null)

  // computed v-model
  const innerValue = computed<string>({
    get:  () => props.modelValue,
    set: v => emit('update:modelValue', v),
  })

  // autofocus 처리
  onMounted(() => {
    if (props.content.autofocus) {
      nextTick(() => inputRef.value?.focus())
    }
  })

  // 부모에서 호출할 check/focus 노출
  function validate () {
    return formRef.value?.validate() ?? false
  }
  function focus () {
    inputRef.value?.focus()
  }
  defineExpose({ validate, focus })
  </script>
