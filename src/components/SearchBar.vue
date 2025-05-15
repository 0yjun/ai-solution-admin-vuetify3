<template>
  <v-row align="center" class="search-filters" wrap>
    <!-- 부모에서 감싼 v-col + 필터 요소들 -->
    <slot />

    <!-- 스페이서 없이 요소 채운 뒤 버튼 -->
    <v-spacer />

    <!-- 검색 버튼 영역 -->
    <v-col class="px-2 d-flex justify-end" cols="auto">
      <slot name="button">
        <v-btn color="primary" @click="$emit('search')">
          검색
        </v-btn>
      </slot>
    </v-col>
  </v-row>
</template>

  <script setup lang="ts">
  </script>

  <style scoped>
  .search-filters {
    /* gap: 16px는 inline style로도 지정 가능 */
  }
  </style>
