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
        <v-btn color="primary" @click="onSearch">
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
      @update="onUpdateClick"
      @update:options="onOptionsUpdate"
    />

    <PopupUpdate
      v-model:dialog="editDialog"
      :model="editModel"
      @update="onUpdate"
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

  const { pagination, fetchPage, options, onOptionsUpdate } = usePage<MemberAdminDto>('/api/members', 10)
  const { mutate:deleteMember, isSuccess:isDeleting, errorMessage: deleteError } = useDelete('/api/members')

  const editModel = ref<MemberAdminDto>(createEmptyMemberAdminDto())
  const editDialog = ref(false)

  options.value = {
    page: 2, // 4번째 페이지부터 시작
    itemsPerPage: 20,
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

  function onSearch () {
    fetchPage({
      search: search.text,
      role: selectedRole.value,
    })
  }

  function onUpdateClick (item: MemberAdminDto) {
    editDialog.value=true
    editModel.value = item
  }

  function onUpdate (item: MemberAdminDto) {
    console.log(item)
    editDialog.value=true
    editModel.value = item
  }

  // 6) 삭제 버튼 클릭
  async function onDelete (id: number | string) {
    await deleteMember(id);
    if(!isDeleting){
      console.error(deleteError)
    }
    await fetchPage({
      search: search.text,
      role: selectedRole.value,
    })
    console.log('Delete clicked, id =', id)
  }
</script>
