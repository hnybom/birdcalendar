import firebase from 'firebase';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

import { config } from './firebaseConfig';


import './assets/app.scss'
import './assets/mapbox-gl.css'
import 'spectre.css/dist/spectre.min.css'
import 'spectre.css/dist/spectre-exp.min.css'
import 'spectre.css/dist/spectre-icons.min.css'
import Autocomplete from 'v-autocomplete'
import VueMapbox from 'vue-mapbox'
import Mapbox from 'mapbox-gl'


Vue.config.productionTip = false;

Vue.use(VueMapbox, { mapboxgl: Mapbox }, Autocomplete)
const app = firebase.initializeApp(config);

new Vue({
  router,
  created() {

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        store.commit('login')
        this.$router.push('/userhome')
      } else {
        this.$router.push('/')
      }
    });
  },
  store,
  render: h => h(App),
}).$mount('#app');

const db = firebase.firestore(app)

export default db
