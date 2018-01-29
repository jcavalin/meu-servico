<template>
  <q-layout ref="layout" view="hHr LpR lFf" :right-breakpoint="1100">
    <!-- Header -->
    <q-toolbar slot="header">
      <q-btn flat @click="$refs.layout.toggleLeft()">
        <q-icon name="menu" />
      </q-btn>
      <q-toolbar-title>
        Meu serviço
        <span slot="subtitle">v0.1.4</span>
      </q-toolbar-title>
    </q-toolbar>
    <!-- Left Side Panel -->
    <div slot="left">
      <q-list no-border link inset-separator>
        <q-side-link item to="/servicos/">
          <q-item-side icon="assignment_ind" />
          <q-item-main label="Serviços" sublabel="Calendário de escalas" />
        </q-side-link>
        <q-side-link item to="/feriados/">
          <q-item-side icon="date_range" />
          <q-item-main label="Feriados" sublabel="Contagem para vermelha" />
        </q-side-link>
        <q-side-link item to="/importar-exportar/">
          <q-item-side icon="import_export" />
          <q-item-main label="Importar/Exportar" sublabel="Transferência de dados" />
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
    if (this.$q.platform.is.desktop) {
      this.$refs.layout.toggleLeft()
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

#app
  width: 95vw
  margin: auto
  display: flex
  flex-direction: column

.z-fixed
  z-index: 10
</style>
