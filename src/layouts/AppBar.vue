<template>
  <v-app-bar
    app
    class="border-b"
    elevation="0"
    flat
    height="51"
  >

    <template #prepend>
      <!-- 데스크탑: 미니 토글 -->
      <v-app-bar-nav-icon class="hidden-sm-and-down" @click="onDrawerMiniClick">
        <v-icon>
          {{ drawerMini ? 'mdi-dots-vertical' : 'mdi-format-list-bulleted' }}
        </v-icon>
      </v-app-bar-nav-icon>

      <!-- 모바일: 오픈/클로즈 토글 -->
      <v-app-bar-nav-icon class="hidden-md-and-up" @click="onDrawerClick">
        <v-icon>
          {{ drawerOpen ? 'mdi-dots-vertical' : 'mdi-format-list-bulleted' }}
        </v-icon>
      </v-app-bar-nav-icon>

      <v-spacer />

      <template
        v-if="drawerMini"
      >
        <img
          cover
          src="/src/assets/aisolution_logo.png"
        >
      </template>
    </template>

    <template #append>
      <v-btn icon @click="showHelp = !showHelp">
        <v-icon>mdi-help-circle</v-icon>
      </v-btn>

      <v-btn
        icon="mdi-theme-light-dark"
        title="toggle theme"
        @click="toggleTheme"
      />

      <v-menu min-width="200px">
        <template #activator="{ props }">
          <v-btn
            icon
            v-bind="props"
          >
            <v-avatar
              color="brown"
              size="large"
            >
              <span class="text-h5">{{ authStore.user?.username }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar
                color="brown"
              >
                <span class="text-h6">{{ authStore.user?.username }}</span>
              </v-avatar>
              <h3>{{ authStore.user?.username }}</h3>
              <p class="text-caption mt-1">
                {{ authStore.user?.role }}
              </p>
              <v-divider class="my-3" />
              <v-btn
                rounded
                variant="text"
              >
                Edit Account
              </v-btn>
              <v-divider class="my-3" />
              <v-btn
                rounded
                variant="text"
                @click="onLogout"
              >
                Logout
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </template>
    <HelpDialog
      v-model="showHelp"
    />
  </v-app-bar>
</template>

<script setup lang="ts">
  import { useDrawerStore } from '@/stores/drawer'
  import { useAuthStore } from '@/stores'
  import { storeToRefs } from 'pinia'
  import { useTheme } from 'vuetify'
  import { useRouter } from 'vue-router'
  import HelpDialog from '@/components/HelpDialog.vue'

  const drawerStore = useDrawerStore()
  const { drawerOpen, drawerMini } = storeToRefs(drawerStore)
  const theme = useTheme()
  const authStore = useAuthStore();
  const router = useRouter();

  // 도움말 토글
  const showHelp = shallowRef(false)

  //데스크탑: 미니 토글
  function onDrawerMiniClick () {
    drawerStore.setDrawerOpen(true)
    drawerStore.toggleDrawerMini()
  }

  // 모바일: 오픈/클로즈 토글
  function onDrawerClick () {
    drawerStore.setDrawerMini(true)
    drawerStore.toggleDrawerOpen()
  }

  //테마 변경
  function toggleTheme () {
    theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  }

  //로그아웃
  async function onLogout (){
    const ok = await authStore.logout();
    if (ok) {
      router.push('/login')
    }
  }

</script>

<style scoped lang="sass"></style>
