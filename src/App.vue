<template>
  <div id="app">
    <TestApiClient />
  </div>
</template>


<script>
import TestApiClient from './components/TestApiClient.vue';

export default {
  components: {
    TestApiClient,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
