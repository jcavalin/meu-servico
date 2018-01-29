<template>
  <div class="feriados">
      <div id="app">
          <h5>Feriados</h5>
          <table class="q-table horizontal-separator striped-odd">
              <thead>
              <tr>
                  <th class="text-center">Feriado</th>
                  <th class="text-center">Ação</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="feriado in lista">
                  <td class="text-center">{{ feriado | formatar }}</td>
                  <td class="text-center">
                      <q-btn round icon="delete_forever" color="negative">
                          <q-popover ref="popover">
                              <q-list separator link>
                                  <q-item @click="excluirFeriado(feriado)">
                                      Sim, excluir este feriado!
                                  </q-item>
                              </q-list>
                          </q-popover>
                      </q-btn>
                  </td>
              </tr>
              </tbody>
          </table>
      </div>

      <q-modal ref="feriadoModal" :content-css="{minWidth: '50vw', minHeight: '55vh'}">
          <q-modal-layout>
              <q-toolbar slot="header">
                  <q-btn flat @click="$refs.feriadoModal.close()">
                      <q-icon name="keyboard_arrow_left" />
                  </q-btn>
                  <div class="q-toolbar-title">
                      Adicionar feriado
                  </div>
              </q-toolbar>
              <div class="layout-padding">
                  <q-datetime v-model="form.feriado" type="date" float-label="Data do feriado" format="DD/MM/YYYY"
                              @blur="$v.form.feriado.$touch"
                              @keyup.enter="submit"
                              :error="$v.form.feriado.$error" />
                  <q-btn icon="add" color="primary" @click="submit" class="full-width">
                      Incluir feriado
                  </q-btn>
              </div>
          </q-modal-layout>
      </q-modal>

      <q-fixed-position corner="bottom-right" :offset="[18, 18]">
          <q-btn round color="primary" @click="adicionarFeriado" title="Adicionar feriado">
              <q-icon name="add" />
          </q-btn>
      </q-fixed-position>
  </div>
</template>

<script>
import { QBtn, QIcon, QFixedPosition, QModal, QModalLayout, QToolbar, QInput, QDatetime, QFab, QPopover, QList, QItem, LocalStorage } from 'quasar'
import { required } from 'vuelidate/lib/validators'
import moment from 'moment'
require('vue-simple-calendar/dist/static/css/default.css')
require('vue-simple-calendar/dist/static/css/holidays-us.css')

export default {
  name: 'home',
  data: function () {
    return {
      showDate: new Date(),
      form: {
        feriado: null
      },
      lista: [],
      feriados: {
        get: function () {
          let feriados = LocalStorage.get.item('feriados')
          feriados = feriados || []
          return feriados
        },
        add: function (feriado) {
          let feriados = this.get()
          feriados.push(moment(feriado).format('YYYY-MM-DD'))
          LocalStorage.set('feriados', feriados)
        },
        delete: function (feriado) {
          let feriados = this.get()
          feriados.splice(feriados.indexOf(feriado), 1)
          LocalStorage.set('feriados', feriados)
        }
      }
    }
  },
  components: {
    QBtn,
    QIcon,
    QFixedPosition,
    QModal,
    QModalLayout,
    QToolbar,
    QInput,
    QDatetime,
    QFab,
    QPopover,
    QList,
    QItem
  },
  validations: {
    form: {
      feriado: { required }
    }
  },
  methods: {
    submit () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        this.incluirFeriado(this.form.feriado)

        this.limparForm()
        this.$refs.feriadoModal.close()
      }
    },
    incluirFeriado (feriado) {
      this.feriados.add(feriado)
      this.lista = this.feriados.get()
    },
    excluirFeriado (feriado) {
      this.feriados.delete(feriado)
      this.lista = this.feriados.get()
    },
    adicionarFeriado () {
      this.limparForm()
      this.$refs.feriadoModal.open()
    },
    limparForm () {
      this.form = {
        feriado: null
      }
    }
  },
  filters: {
    formatar (data) {
      return moment(data).format('DD/MM/YYYY')
    }
  },
  mounted () {
    this.lista = this.feriados.get()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
@import '~variables'
.q-table
    width: 95vw
</style>
