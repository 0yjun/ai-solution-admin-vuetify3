/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { VTreeview } from 'vuetify/labs/VTreeview'
// Composables
import { createVuetify } from 'vuetify';
import colors from 'vuetify/util/colors'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components:{
    VTreeview,
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          'table-header-color': colors.grey.lighten2,
        },
      },
    },
  },
});
