/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins';

// Components
import App from './App.vue';

// Composables
import { createApp } from 'vue';

// Pinia
import { createPinia } from 'pinia';

const pinia = createPinia();

const app = createApp(App);
app.use(pinia);

registerPlugins(app);

// scss
import '@/styles/global.scss'
import '@/styles/table.scss'

// 새로고침시 JWT로 세션 유지
import { useAuthStore } from './stores';
const authStore = useAuthStore()
if(!authStore.isAuthenticated){
  try {
    await authStore.fetchMe()
    console.log(`fetchMe 완료, isAuthenticated=${authStore.isAuthenticated}`)
  } catch (e) {
    console.error('세션 확인 실패', e)
  }
}

app.mount('#app');
