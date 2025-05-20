<template>
  <v-data-table-server
    class="overflow-y-scroll"
    density="comfortable"
    :headers="headers"
    :items="pagination.content"
    :items-length="pagination.totalElements"
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
          @click="emit('popup:reset-password', item)"
        >
          mdi-key-change
        </v-icon>

        <v-icon
          class="cursor-pointer"
          small
          @click="emit('popup:update', item)"
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
  </v-data-table-server>
</template>

<script setup lang="ts">
  import type { DataTableOptions, IndexListProps, MemberAdminDto } from '@/types';


  const { pagination, options, headers } = defineProps<IndexListProps>()
  const emit = defineEmits<{
    (e: 'update:options', opts: DataTableOptions): void
    (e: 'popup:update', item: MemberAdminDto): void
    (e: 'popup:reset-password', item: MemberAdminDto): void
    (e: 'delete', id: number | string): void
  }>()
</script>
