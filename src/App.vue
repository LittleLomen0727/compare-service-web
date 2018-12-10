<template>
  <div id="app">
    <Spin v-if="pageLoading"
          size="large"
          fix>
    </Spin>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      pageLoading: false
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}
</style>
