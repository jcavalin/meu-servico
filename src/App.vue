<template>
  <q-layout ref="layout" view="hHr LpR lFf" :right-breakpoint="1100">
    <!-- Header -->
    <q-toolbar slot="header">
      <q-btn flat @click="$refs.layout.toggleLeft()">
        <q-icon name="menu" />
      </q-btn>
      <q-toolbar-title>
        Meu serviço
        <span slot="subtitle">Contagem de escalas</span>
      </q-toolbar-title>
    </q-toolbar>
    <!-- Left Side Panel -->
    <div slot="left">
      <q-list no-border link inset-separator>
        <q-side-link item to="/">
          <q-item-side icon="assignment_ind" />
          <q-item-main label="Serviços" sublabel="Calendário de escalas" />
        </q-side-link>
        <q-side-link item to="/feriados">
          <q-item-side icon="date_range" />
          <q-item-main label="Feriados" sublabel="Contagem para vermelha" />
        </q-side-link>
      </q-list>
    </div>
    <!-- sub-routes get injected here: -->
    <router-view></router-view>
  </q-layout>
</template>

<script>
import { QLayout, QList, QSideLink, QItemSide, QItemMain, QToolbar, QBtn, QIcon, QToolbarTitle } from 'quasar'

/*
 * Root component
 */
export default {
  components: {
    QLayout,
    QList,
    QSideLink,
    QItemSide,
    QItemMain,
    QToolbar,
    QBtn,
    QIcon,
    QToolbarTitle
  },
  mounted () {
    this.$refs.layout.toggleLeft()
  }
}
</script>

<style lang="stylus">
@import '~variables'
</style>
