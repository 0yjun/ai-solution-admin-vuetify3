<template>
  <v-container fluid>
    <!-- 검색 폼 -->
    <v-row align="center" wrap>
      <!-- 유저 검색어 입력 (cols=3) -->
      <v-col class="px-2" cols="3">
        <v-text-field
          v-model="search.text"
          clearable
          dense
          hide-details
          :label="search.label"
          outlined
          :placeholder="search.placeholder"
          @keydown.enter="onSearch"
        />
      </v-col>

      <!-- 권한 콤보박스 (cols=2) -->
      <v-col class="px-2" cols="3">
        <Combo
          v-model="selectedRole"
          :append-items="[{ value: null, label: '전체' }]"
          fetch-url="/api/constants/roles"
          hide-detail
          item-label="label"
          item-value="value"
          label="권한등급"
        />
      </v-col>

      <!-- 검색 버튼 (나머지 영역 차지 + 오른쪽 정렬) -->
      <v-col class="px-2 d-flex justify-end">
        <v-btn color="primary" @click="onSearch">
          검색
        </v-btn>
      </v-col>
    </v-row>

  </v-container>

  <v-container>
    <IndexList
      :contents="contents"
      :headers="headers"
    />
  </v-container>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import axios from 'axios'
  import Combo from '@/components/Combo.vue'
  import IndexList from '@/pages/System/member-management/indexList.vue'
  import type { ApiResponse, MemberDto } from '@/types'

  // 검색 폼 상태
  const search = reactive({
    text: '',
    label: '검색어',
    placeholder: '검색어를 입력하세요.',
  })
  const selectedRole = ref<string | null>(null)

  // 테이블 컬럼 정의
  const headers = [
    { title: '유저명', value: 'username',width:'20%' },
    { title: '권한', value: 'role' , width:'30%' },
    { title: '설명', value: 'role' , width:'50%' },
  ]

  // 조회 결과
  const contents = ref<MemberDto[]>([])

  // 검색 & API 호출 (pageable 없이)
  async function onSearch () {
    try {
      const response = await axios.get<ApiResponse<MemberDto[]>>('/api/members', {
        params: {
          search: search.text,
          ...(selectedRole.value != null ? { role: selectedRole.value } : {}),
        },
      })
      const api = response.data
      if (api.code === 'SUCCESS' && api.data) {
        contents.value = api.data.content
        alert(api.message)
      } else {
        contents.value = []
        alert(api.message)
      }
    } catch (err: unknown) {
      let errorMessage = '알 수 없는 오류'
      if (axios.isAxiosError(err) && err.response) {
        const apiErr = err.response.data as ApiResponse<null>
        errorMessage = apiErr?.message || errorMessage
      }
      alert(errorMessage)
    }
  }

  // 초기 로드
  onSearch()
</script>

<style scoped>
.search-row {
  gap: 16px;
}
</style>
