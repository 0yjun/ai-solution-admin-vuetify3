<!-- <template>
  <v-dialog
    v-if="help"
    v-model="visible"
    max-width="800"
  >
    <v-skeleton-loader
      v-if="isLoading"
      class="mx-auto border"
      max-width="300"
      type="card-avatar, actions"
    />
    <v-card
      v-else
    >
      <v-carousel
        v-if="help.images?.length"
        cycle
        hide-delimiter-background
        show-arrows="hover"
      >
        <template
          v-for="img in help.images"
          :key="img.id"
        >
          <v-carousel-item
            :src="img.url"
          />
          <div>
            {{ img.imageDescription }}
          </div>
        </template>
      </v-carousel>
    </v-card>
  </v-dialog>
</template> -->

<template>
  <v-dialog
    v-model="visible"
    fullscreen
    scrim-color="rgba(0, 0, 0, 0.7)"
    transition="dialog-bottom-transition"
  >
    <template #default>
      <v-card class="fill-height white--text" flat>
        <!-- 상단 닫기 버튼 -->
        <v-toolbar dark flat>
          <v-spacer />
          <v-btn icon @click="emit('update:modelValue',false)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <!-- 로딩 상태 스켈레톤 -->
        <v-skeleton-loader
          v-if="isLoading"
          class="mx-auto"
          max-width="300"
          type="card-avatar, actions"
        />

        <!-- 이미지가 있을 때 캐러셀 -->
        <v-carousel
          v-else-if="help?.images?.length"
          cycle
          height="100%"
          hide-delimiter-background
          show-arrows-on-hover
        >
          <v-carousel-item
            v-for="img in help.images"
            :key="img.id"
          >
            <v-img class="fill-height" :src="img.url">
              <template #placeholder>
                <v-skeleton-loader type="image" />
              </template>
            </v-img>
            <div class="carousel-caption">
              {{ img.imageDescription }}
            </div>
          </v-carousel-item>
        </v-carousel>

        <!-- 이미지가 없을 때 -->
        <div v-else class="no-images text-center">
          도움말 이미지가 없습니다.
        </div>
      </v-card>
    </template>
  </v-dialog>
</template>


<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import type { HelpDto } from '@/types/api/help.dto';
  import { useSearch } from '@/hooks/useSearch';

  const { data:help ,fetch, isLoading, isSuccess, errorMessage } = useSearch<HelpDto>('/api/helps')

  // Props
  const props = defineProps({
    modelValue: Boolean,
  })


  // Local state
  const route = useRoute()
  const visible = ref(props.modelValue)
  // Sync prop
  // Sync prop
  watch(() => props.modelValue, val => {
    visible.value = val
    if (val) fetchHelp()
  })
  const emit = defineEmits<{
    (e: 'update:modelValue', v: boolean): void
  }>()

  watch(visible, val => emit('update:modelValue', val))

  async function fetchHelp (){
    const menuId = route.matched
      .find(r=>r.meta.menuId !==undefined)
      ?.meta.menuId
    // if(!menuId){
    //   alert('현재 페이지에 구성된 도움말이 없습니다.')
    // }

    await fetch({ params: { menuId } })
    if(!isSuccess){
      alert(errorMessage)
    }
  }
</script>

<style scoped>
.carousel-caption {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.6);
  padding: 8px 16px;
  border-radius: 4px;
  max-width: calc(100% - 32px);
  text-align: center;
  color: white;
}
.no-images {
  margin-top: 40vh;
  color: rgba(255, 255, 255, 0.7);
}
</style>
