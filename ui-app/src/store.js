import firebase from 'firebase';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loggedIn: false

  },
  mutations: {
    login (state) {
      state.loggedIn = true
    },
    logout (state) {
      state.loggedIn = false
    },

  },
  actions: {
    logout (context) {
      firebase.auth().signOut().then(() => {
        context.commit('logout')
      }).catch(() => {
        console.log("Rogout failed!")
      })
    }
  },
});
