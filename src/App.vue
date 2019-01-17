<template>
  <div id="app"
       style="margin-top:30px">
    <Spin v-show="pageLoading"
          size="large"
          fix>
    </Spin>
    <Spin v-show="showComparing"
          class="demo-spin-col"
          fix>Comparing...</Spin>
    <router-view />
    <BackTop></BackTop>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapState([
      'pageLoading',
      'showComparing'
    ])
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
}

.demo-spin-col {
  border: 1px solid #eee;
}
</style>
