<template>
  <v-container
    class="pb-0 mb-0"
    fluid
  >
    <!-- 검색 폼 -->
    <v-row>
      <!-- 유저 검색어 입력 (sm=2) -->
      <v-col
        sm="2"
      >
        <v-text-field
          v-model="search.text"
          clearable
          density="compact"
          hide-details
          :label="search.label"
          outlined
          :placeholder="search.placeholder"
          @keydown.enter="onSearch"
        />
      </v-col>

      <!-- 권한 콤보박스 (sm=2) -->
      <v-col
        sm="2"
      >
        <Combo
          v-model="selectedRole"
          :append-items="[{ value: null, label: '전체' }]"
          density="compact"
          fetch-url="/api/constants/roles"
          hide-detail
          item-label="label"
          item-value="value"
          label="권한등급"
        />
      </v-col>
      <!-- 검색 버튼 (나머지 영역 차지 + 오른쪽 정렬) -->
      <v-col class="d-flex justify-end">
        <v-btn color="primary" @click="onSearch">
          검색
        </v-btn>
      </v-col>
    </v-row>
  </v-container>

  <v-container
    class="pt-0 mt-0 "
    fluid
  >
    <v-row>
      <v-col class="d-flex justify-end">
        <v-btn color="primary" @click="onCreateClcik">
          생성
        </v-btn>
      </v-col>
    </v-row>
  </v-container>

  <v-container fluid>
    <IndexList
      :headers="headers"
      :options="options"
      :pagination="pagination"
      @delete="onDelete"
      @popup:reset-password="onResetPasswordClick"
      @popup:update="onUpdateClick"
      @update:options="onOptionsUpdate"
    />

    <PopupUpdate
      v-model:dialog="editDialog"
      :model="editModel"
      @update="onUpdate"
    />

    <PopupResetPassword
      v-model:dialog="resetPwDialog"
      :model="resetPwModel"
      @update="onResetPassword"
    />

    <PopupCreate
      v-model:dialog="createDialog"
      :model="createModel"
      @update="onCreate"
    />
  </v-container>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import Combo from '@/components/Combo.vue'
  import type { DataTableHeader, MemberAdminDto } from '@/types'
  import { usePage } from '@/hooks/usePage'
  import IndexList from './indexList.vue'
  import { useDelete } from '@/hooks/useDelete'
  import PopupUpdate from './popupUpdate.vue'
  import { createEmptyMemberAdminDto } from '@/utils/initObjects'
  import { useUpdate } from '@/hooks/useUpdate'
  import { useCreate } from '@/hooks/useCreate'
  import PopupCreate from './popupCreate.vue'
  import PopupResetPassword from './popupResetPassword.vue'

  const { pagination, fetchPage, options, onOptionsUpdate } = usePage<MemberAdminDto>('/api/members', 10)
  const { mutate:deleteMember, isSuccess:isDeleting, errorMessage: deleteError } = useDelete('/api/members')
  const { mutate:updateMember, isSuccess:isUpdating, errorMessage: updateError } = useUpdate('/api/members')
  const { mutate:resetPasswordMember, isSuccess:isPwChanging, errorMessage: pwError } = useUpdate('/api/members')
  const { mutate:createMember, isSuccess:isCreating, errorMessage: createError } = useCreate('/api/members')

  const editModel = ref<MemberAdminDto>(createEmptyMemberAdminDto())
  const editDialog = ref(false)

  const resetPwModel = ref<MemberAdminDto>(createEmptyMemberAdminDto())
  const resetPwDialog = ref(false)

  const createModel = ref<MemberAdminDto>(createEmptyMemberAdminDto())
  const createDialog = ref(false)

  options.value = {
    page: 1,
    itemsPerPage: 10,
    sortBy: [
      { key: 'role', order: 'desc' }, // 기본 정렬
      { key: 'username', order: 'asc' },
    ],
  }

  // 초기 로드
  onMounted(() => {
    fetchPage({
      search: search.text,
      role: selectedRole.value,
    })
  })

  // 검색 폼 상태
  const search = reactive({
    text: '',
    label: '검색어',
    placeholder: '검색어를 입력하세요.',
  })

  const selectedRole = ref<string | null>(null)

  const headers:DataTableHeader[] = [
    { title: '유저명', sortable: true, value: 'username',width:'20%' },
    { title: '권한', sortable: true, value: 'role' , width:'30%' },
    { title: '설명', value: 'description' , width:'50%' },
    { title: '', value:'', key: 'actions', align: 'end', sortable: false },
  ]

  async function onSearch () {
    fetchPage({
      search: search.text,
      role: selectedRole.value,
    })
  }

  function onUpdateClick (item: MemberAdminDto) {
    editDialog.value=true
    editModel.value = item
  }

  function onResetPasswordClick (item: MemberAdminDto) {
    resetPwDialog.value=true
    resetPwModel.value = item
  }

  function onCreateClcik () {
    createDialog.value=true
    createModel.value = createEmptyMemberAdminDto()
  }

  async function onUpdate (item: MemberAdminDto) {
    if( typeof item.id?.toString() !== 'string'){
      return
    }
    await updateMember(item?.id?.toString(), item)
    if(!isUpdating){
      console.error(updateError)
    }
    await onSearch();
  }

  async function onResetPassword (item: MemberAdminDto) {
    if( typeof item.id?.toString() !== 'string'){
      return
    }
    await resetPasswordMember(`${item.id}/password/reset`, item)
    if(!isPwChanging){
      console.error(pwError)
    }
    await onSearch();
  }

  async function onCreate (item: MemberAdminDto) {
    await createMember(item)
    if(!isCreating){
      console.error(createError)
    }
    await onSearch();
  }

  async function onDelete (id: number | string) {
    await deleteMember(id);
    if(!isDeleting){
      console.error(deleteError)
    }
    await onSearch();
  }
</script>
