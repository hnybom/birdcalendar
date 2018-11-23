<template>

  <div id="app">

    <header class="navbar">
      <section class="navbar-section">
        <router-link to="/" v-if="!loggedIn" class="navbar-brand mr-2">HOME</router-link>
        <router-link to="/userhome" v-if="loggedIn" class="navbar-brand mr-2">HOME</router-link>
        <router-link to="/about" class="btn btn-link">About</router-link>
      </section>
      <section class="navbar-center">
          <img src="./assets/bird-logo.jpg" height="80px"/>
      </section>
      <section class="navbar-section">
      </section>
    </header>
    <router-view  v-if="loggedIn"/>
    <Login  v-if="!loggedIn"/>

  </div>
</template>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.navbar  {
  margin: 0 30px;
  font-weight: bold;
}
</style>

<script>
  import firebase from "firebase"
  import store from './store'
  import Login from './components/Login'

  export default {
    computed: {
      loggedIn() {
        return store.state.loggedIn
      }
    },
    components: {
      Login
    }
  }
</script>
