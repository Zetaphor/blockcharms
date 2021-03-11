<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <ViewMain />
  </div>
</template>

<script>
import ViewMain from './components/ViewMain.vue'

export default {
  name: 'App',
  components: {
    ViewMain
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
