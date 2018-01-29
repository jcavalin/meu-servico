<template>
  <div class="home">
  </div>
</template>

<script>
import router from 'router'

export default {
  name: 'home',
  mounted () {
    router.push('servicos')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
@import '~variables'
</style>
