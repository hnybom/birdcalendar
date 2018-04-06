// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import firebase from 'firebase/app';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import Vue from 'vue';
import App from './App';
import router from './router';

Vue.use(Vuetify);

Vue.config.productionTip = false;

const config = {
  apiKey: 'AIzaSyBkmjAJ5I_s1tbPYibXy2cc7TOvjdL1aGw',
  authDomain: 'birdcalendar-hn.firebaseapp.com',
  databaseURL: 'https://birdcalendar-hn.firebaseio.com',
  projectId: 'birdcalendar-hn',
  storageBucket: 'birdcalendar-hn.appspot.com',
  messagingSenderId: '603078411546',
};
firebase.initializeApp(config);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
