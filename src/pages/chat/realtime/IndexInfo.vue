<template>
  <v-card v-if="props.sessionId" class="pa-4">
    <v-card-title>
      SESSION ID: <strong class="ml-2">{{ props.sessionId }}</strong>
    </v-card-title>
    <v-divider class="my-2" />

    <v-card-text>
      <ChatLogItem
        v-for="(msg, idx) in messages"
        :key="idx"
        class="mb-4"
        :message="msg"
      />
    </v-card-text>
  </v-card>

  <v-card v-else class="pa-4">
    <v-card-text>세션을 선택하세요.</v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import type { ChatMessageDto } from '@/types/api/chat-message.dto';
  import { onUnmounted, ref, watch } from 'vue'
  import ChatLogItem from '@/pages/chat/realtime/chatLogItem.vue';

  // Props 정의
  const props = defineProps<{ sessionId: string | undefined }>()

  // 상태 변수
  const url = ref('')
  const sseConnection = ref<EventSource | null>(null)
  const messages = ref<ChatMessageDto[]>([])

  // SSE 연결
  function connectSSE (sessionId: string) {
    url.value = `/api/chat/sessions/${sessionId}/stream`
    const es = new EventSource(url.value, { withCredentials: true })

    es.onmessage = handleMessage
    es.onerror = handleError

    sseConnection.value = es
  }

  // SSE 연결 해제
  function disconnectSSE () {
    if (sseConnection.value) {
      sseConnection.value.close()
      sseConnection.value = null
    }
  }

  // SSE 메시지 수신 처리
  function handleMessage (e: MessageEvent) {
    try {
      const parsed = JSON.parse(e.data) as ChatMessageDto
      messages.value.push(parsed) // title은 필요한 경우 커스터마이징
    } catch (err) {
      console.error('[SSE 파싱 실패]', err)
    }
  }

  // SSE 에러 처리
  function handleError (e: Event) {
    console.error('[SSE ERROR]', e)
  }

  // sessionId 변경 시 SSE 연결 관리
  watch(
    () => props.sessionId,
    sessionId => {
      if (!sessionId) return
      disconnectSSE()
      messages.value = []
      connectSSE(sessionId)
    },
    { immediate: true }
  )

  // 컴포넌트 언마운트 시 SSE 정리
  onUnmounted(() => {
    disconnectSSE()
  })

  // 필요 시 메시지 목록을 export
  defineExpose({
    messages,
  })
</script>
