<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <header></header>
    <main>
      <img src="/statics/icons/icon-192x192.png" class="logo" alt="Meu serviço">
      <h4>Meu serviço</h4>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
/*
 * Root component
 */
export default {}
</script>

<style lang="stylus">
@import '~variables'

main
  text-align center
  margin-top 40px

header
  margin 0
  height 10px
  background-color $primary

.logo
  width: 10vw
</style>
