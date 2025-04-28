<template>
  <v-container class="fill-height" fluid>
    <v-row class="fill-height">
      <v-col cols="3">
        <indexTree />
      </v-col>
      <v-col cols="9">
        9
      </v-col>
    </v-row>
  </v-container>

</template>

<script setup lang="ts">
  import indexTree from '@/pages/System/menu-management/indexTree.vue';
</script>
