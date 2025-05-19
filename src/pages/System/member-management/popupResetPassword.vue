<template>
  <v-dialog
    max-width="500"
    :model-value="props.dialog"
  >
    <v-confirm-edit
      ref="confirm"
      cancel-text="취소"
      :model-value="props.model"
      ok-text="수정"
      @cancel="emit('update:dialog',false)"
      @save="onSaveClick"
    >

      <template #default="{ model: proxyModel, actions }">
        <v-card title="Modify Data">
          <v-card-text>
            <template v-for="(f) in defaultFields" :key="f.key">

              <v-text-field
                v-if="f.type==='text'"
                ref="inputRef"
                v-model="proxyModel.value[f.key]"
                :autofocus="f.autofocus"
                :class="{ 'text-required': f.color }"
                :counter="f.counter && f.maxlength || false"
                dense
                density="compact"
                :disabled="f.disabled"
                :label="f.label"
                outlined
                :placeholder="f.placeholder"
                :rules="f.rule"
              />
            </template>
          </v-card-text>

          <template #actions>
            <v-spacer />
            <component :is="actions" />
          </template>


        </v-card>
      </template>
    </v-confirm-edit>
  </v-dialog>
</template>

<script setup lang="ts">
  import type { BaseFormFieldProps, MemberAdminDto } from '@/types';

  const props = defineProps<{
    dialog: boolean
    model: MemberAdminDto
  }>()

  const emit = defineEmits<{
    (e: 'update:dialog', value:boolean): void,
    (e: 'update', item: MemberAdminDto): void
  }>()

  function onSaveClick (updated: MemberAdminDto) {
    emit('update', updated)
    emit('update:dialog',false)
  }

  const defaultFields: Omit<BaseFormFieldProps, 'text' | 'temp'>[] = [
    {
      key: 'username',
      name: 'username',
      label: '유저아이디',
      placeholder: '유저아이디를 입력하세요.',
      disabled: true,
      maxlength: 20,
      counter: true,
      type: 'text',
      autofocus: true,
      color: true,
      message: '유저아이디를 확인해주세요.',
      rule: [
        (v: string) => !!v || '유저아이디는 필수 입력사항입니다.',
        (v: string) => !(v && v.length > 20) || '유저아이디는 20자 이상 입력할 수 없습니다.',
      ],
    },

    {
      key: 'password',
      name: 'password',
      label: '비밀번호',
      placeholder: '비밀번호를 입력하세요.',
      disabled: false,
      maxlength: 20,
      counter: true,
      type: 'text',
      autofocus: true,
      color: true,
      message: '비밀번호를 확인해주세요.',
      rule: [
        (v: string) => !!v || '비밀번호는 필수 입력사항입니다.',
        (v: string) => !(v && v.length > 20) || '비밀번호는 20자 이상 입력할 수 없습니다.',
      ],
    },

  ]
</script>
