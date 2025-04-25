/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '../stores'
import router from '../router'

// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  console.log('registerPlugins 실행')
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
}
