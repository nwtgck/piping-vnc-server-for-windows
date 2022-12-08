import { createApp } from 'vue';
// import Vuetify from 'vuetify/lib/framework';
import { createVuetify } from 'vuetify';
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import App from '../App.vue';

const vuetify = createVuetify({
  components,
  directives,
});
// Vue.use(Vuetify);

library.add(faGithub);
// Vue.component('font-awesome-icon', FontAwesomeIcon);
// export default new Vuetify({
//   icons: {
//     iconfont: "mdiSvg"
//   }
// });

// @ts-ignore
const x = createApp(App)
  .use(vuetify)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');

export default x;
