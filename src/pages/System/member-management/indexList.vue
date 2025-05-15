<template>
  <v-data-table
    dense
    :headers="headers"
    :items="contents"
  />
</template>


<script setup lang="ts">
  import type { MemberDto } from '@/types';

  defineProps<{
    headers: object[]
    contents: MemberDto[]
  }>()
</script>
