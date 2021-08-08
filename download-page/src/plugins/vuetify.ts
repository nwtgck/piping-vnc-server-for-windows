import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

Vue.use(Vuetify);

library.add(faGithub);
Vue.component('font-awesome-icon', FontAwesomeIcon);
export default new Vuetify({
  icons: {
    iconfont: "mdiSvg"
  }
});
