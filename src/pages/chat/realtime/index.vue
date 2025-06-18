<template>
  <v-container class="fill-height fluid pb-1 pt-1 pl-3 pr-3" fluid>
    <v-row class="fill-height">
      <!-- 사이드바: 권한 선택 + 트리 -->
      <v-col cols="3">
        <v-card>
          <v-card-title
            class="d-flex align-center justify-end list-title"
            outlined
          >
            <v-tooltip text="갱신">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  aria-label="갱신"
                  icon
                  @click="refresh"
                >
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </v-card-title>
          <v-divider />
          <div class="d-flex mt-2 mb-0">
            <v-text-field
              v-model="search.text"
              :autofocus="search.autoFocus"
              hide-details
              :label="search.label"
              :placeholder="search.placeholder"
              @keydown.enter="onSearch"
            />
            <v-tooltip text="search">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  aria-label="search"
                  icon
                  @click="onSearch"
                >
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </div>

          <v-divider />

          <template v-if="isLoading">
            <v-skeleton-loader
              class="d-flex"
              :loading="isLoading"
              type="list-item"
            />
          </template>
          <template v-else>
            <v-list
              v-model:selected="selectedSessionId"
              select-strategy="single-leaf"

              @update:selected="onselectChange"
            >
              <v-list-item
                v-for="item in sessionIds"
                :key="item"
                :title="item"
                :value="item"
              />
            </v-list>
          </template>
          {{ selectedSessionId }}

        </v-card>
      </v-col>

      <!-- 상세 정보 -->
      <v-col cols="8">
        <IndexInfo
          :session-id="selectedSessionId[0]"
        />
      </v-col>

    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref } from 'vue'
  import { useSearch } from '@/hooks/useSearch'
  import IndexInfo from '@/pages/chat/realtime/IndexInfo.vue'

  const { data: sessionIds, fetch:refresh, isLoading } = useSearch<string[]>('/api/chat/sessions/recent')
  const selectedSessionId = ref<string[]>([])

  const search = reactive({
    text: '',
    label: '세션아이디',
    placeholder: '세션 아이디를 입력하세요.',
    autoFocus: true,

  });

  // 1) 초기 로드
  onMounted(async () => {
    await onRefresh()
    selectedSessionId.value = [sessionIds.value ? sessionIds.value[0]:'']
  })

  async function onRefresh (){
    await refresh()
    search.text = ''
    selectedSessionId.value=[]
  }

  function onSearch (){
    selectedSessionId.value = [search.text]
  }

  function onselectChange (e:string[]){
    search.text = e[0]
  }


</script>
