<template>
  <v-data-table
    density="comfortable"
    :headers="headers"
    :items="pagenation.content"
    :items-per-page="pagenation.size"
    multi-sort
    :server-items-length="pagenation.totalElements"
    :v-model:options="options"
    @update:options="onOptionsUpdate"
  >
    <template #item.actions="{ item }">
      <div class="d-flex ga-2 justify-end">
        <v-icon color="medium-emphasis" icon="mdi-pencil" size="small" @click="edit(item.id)" />
        <v-icon color="medium-emphasis" icon="mdi-delete" size="small" @click="remove(item.id)" />
      </div>
    </template>
  </v-data-table>
</template>


<script setup lang="ts">
  import type { MemberAdminDto } from '@/types';
  import type { IndexListProps } from '@/types/common/index-list.type';

  defineProps<IndexListProps<MemberAdminDto>>()


</script>
