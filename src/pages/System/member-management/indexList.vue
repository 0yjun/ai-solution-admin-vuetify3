<template>
  <v-data-table
    density="comfortable"
    :headers="headers"
    :items="pagination.content"
    :items-per-page="pagination.size"
    multi-sort
    :options="options"
    :server-items-length="pagination.totalElements"
    @update:options="opts => emit('update:options', opts)"
  >
    <template #item.actions="{ item }">
      <div class="d-flex gap-2 justify-end">
        <!-- 연필 아이콘: 수정 -->
        <v-icon
          class="cursor-pointer"
          small
          @click="emit('update', item.id)"
        >
          mdi-pencil
        </v-icon>

        <!-- 휴지통 아이콘: 삭제 -->
        <v-icon
          class="cursor-pointer"
          small
          @click="emit('delete', item.id)"
        >
          mdi-delete
        </v-icon>
      </div>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
  import type { DataTableOptions, IndexListProps } from '@/types';


  const { pagination, options, headers } = defineProps<IndexListProps>()
  const emit = defineEmits<{
    (e: 'update:options', opts: DataTableOptions): void
    (e: 'update', id: number | string): void
    (e: 'delete', id: number | string): void
  }>()
</script>
