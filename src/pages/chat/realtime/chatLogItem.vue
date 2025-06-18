<template>
  <v-expansion-panels multiple>
    <!-- 사용자 질문 -->
    <v-expansion-panel>
      <v-expansion-panel-title>
        <span class="font-weight-medium">사용자 질문</span>
        <div class="text-truncate ml-4" style="max-width: 70%">
          {{ message.query }}
        </div>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <div class="pa-2">
          {{ message.query }}
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>

    <!-- LLM 답변 -->
    <v-expansion-panel>
      <v-expansion-panel-title>
        <span class="font-weight-medium">LLM 답변</span>
        <div class="text-truncate ml-4" style="max-width: 70%">
          {{ message.llmResponse }}
        </div>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <div class="pa-2">
          {{ message.llmResponse }}
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>

    <!-- 상세 정보 -->
    <v-expansion-panel>
      <v-expansion-panel-title>
        <span class="font-weight-medium">상세 정보</span>
        <v-chip class="ml-4" size="small" variant="outlined">
          {{ message.intent }}
        </v-chip>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-table dense>
          <tbody>
            <tr v-for="[key, value] in Object.entries(message)" :key="key">
              <td class="font-weight-medium">{{ key }}</td>
              <td>
                <pre v-if="typeof value === 'object'">{{ JSON.stringify(value, null, 2) }}</pre>
                <span v-else>{{ value }}</span>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
  import type { ChatMessageDto } from '@/types/api/chat-message.dto';


  defineProps<{
    message: ChatMessageDto
  }>()
</script>

<style scoped>
.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
