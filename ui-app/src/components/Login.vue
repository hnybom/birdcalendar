<template>
  <div class="login">
    <div id="firebaseui-auth-container"></div>
  </div>
</template>

<script>
// @ is an alias to /src
import firebase from 'firebase'
import firebaseui from 'firebaseui'
import { config } from '../firebaseConfig';
import 'firebaseui/dist/firebaseui.css'

export default {
  name: 'home',
  created() {
    const uiConfig = {
      signInSuccessUrl: '/userhome',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ],
    };
    const ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', uiConfig);
  },
};
</script>
