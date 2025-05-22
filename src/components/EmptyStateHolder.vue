<template>
  <v-card-text class="text-center py-12">
    <v-icon :size="iconSize">{{ icon }}</v-icon>
    <pre class="text-h6 font-weight-medium mt-4">{{ text }}</pre>
    <slot />
  </v-card-text>
</template>

<script setup lang="ts">
  import { type PropType } from 'vue';

  defineProps({
    /** 표시할 아이콘 이름 (mdi-*) */
    icon: {
      type: String as PropType<string>,
      default: 'mdi-information-outline',
    },
    /** 아이콘 크기 */
    iconSize: {
      type: [Number, String] as PropType<number | string>,
      default: 48,
    },
    /** 안내 메시지 텍스트 */
    text: {
      type: String as PropType<string>,
      default: '오류',
    },
  });
</script>
