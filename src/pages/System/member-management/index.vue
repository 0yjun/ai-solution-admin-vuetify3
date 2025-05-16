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
      :on-options-update="onOptionsUpdate"
      :options="options"
      :page="page"
    />
  </v-container>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import Combo from '@/components/Combo.vue'
  import type { MemberAdminDto } from '@/types'
  import { usePage } from '@/hook/usePage'
  import IndexList from './indexList.vue'
  import type { PageOptionsType } from '@/types/page'

  const { page, fetchPage } = usePage<MemberAdminDto>('/api/members', 10)

  // 초기 로드
  onMounted(() => {
    onSearch ()
  })

  // 검색 폼 상태
  const search = reactive({
    text: '',
    label: '검색어',
    placeholder: '검색어를 입력하세요.',
  })

  const selectedRole = ref<string | null>(null)

  const options = ref<PageOptionsType>({
    page: 1,
    itemsPerPage: 10,
    sortBy: [{ key: 'role', order: 'asc' }, { key: 'username', order: 'asc' }],
  })

  const headers = [
    { title: '유저명', sortable: true, value: 'username',width:'20%' },
    { title: '권한', sortable: true, value: 'role' , width:'30%' },
    { title: '설명', value: 'description' , width:'50%' },
    { title: '', key: 'actions', align: 'end', sortable: false },
  ]

  function onSearch () {
    const sortArray = options.value.sortBy.map(({ key, order }) =>
      `${key},${order}`
    )
    fetchPage({
      search: search.text,
      role: selectedRole.value,
      page: options.value.page - 1,
      size: options.value.itemsPerPage,
      sort:sortArray,
    })
  }

  function onOptionsUpdate (newOpts: PageOptionsType) {
    // 1) page, itemsPerPage 만 바꾸고
    options.value.page = newOpts.page
    options.value.itemsPerPage = newOpts.itemsPerPage

    // 2) sortBy: 유저가 직접 헤더 클릭으로 바꾼 경우에만 덮어쓰기
    // if (newOpts.sortBy.length) {
    //   options.value.sortBy = newOpts.sortBy
    // }
    console.log(options.value)
    onSearch()
  }
</script>
