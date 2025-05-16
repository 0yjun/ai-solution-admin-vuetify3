<template>
  <v-data-table
    density="compact"
    :headers="headers"
    :items="page.content"
    :items-per-page="page.size"
    multi-sort
    :server-items-length="page.totalElements"
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
  import type { PageType } from '@/types/page';

  defineProps<{
    page: PageType<MemberAdminDto>
    options: object
    headers: object[]
    onOptionsUpdate: (value:any)=>any
  }>()


</script>
