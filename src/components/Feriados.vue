<template>
  <div class="feriados">
      <div id="app">
          <h5>Feriados</h5>
          <q-data-table
                  :data="lista"
                  :config="config"
                  :columns="columns"
          >
              <template slot="col-excluir" slot-scope="feriado">
                  <q-btn round icon="delete_forever" color="negative">
                      <q-popover ref="popover">
                          <q-list separator link>
                              <q-item @click="excluirFeriado({data: feriado.data, descricao: feriado.descricao})">
                                  Sim, excluir este feriado!
                              </q-item>
                          </q-list>
                      </q-popover>
                  </q-btn>
              </template>
          </q-data-table>
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
                  <q-datetime v-model="form.data" type="date" float-label="Data do feriado" format="DD/MM/YYYY"
                              @blur="$v.form.data.$touch"
                              @keyup.enter="submit"
                              :error="$v.form.data.$error" />
                  <q-input v-model="form.descricao" float-label="Descrição"
                           @blur="$v.form.descricao.$touch"
                           @keyup.enter="submit"
                           :error="$v.form.descricao.$error" />
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
import { QBtn, QIcon, QFixedPosition, QModal, QModalLayout, QToolbar, QInput, QDatetime, QFab, QPopover, QList, QItem, QDataTable } from 'quasar'
import { required } from 'vuelidate/lib/validators'
import { Feriados } from './model/Feriados'
import moment from 'moment'

export default {
  name: 'feriados',
  data: function () {
    return {
      form: {
        data: null,
        descricao: null
      },
      lista: [],
      feriados: Feriados,
      config: {
        responsive: true,
        pagination: {
          rowsPerPage: 10,
          options: [5, 10, 15, 30, 50, 500]
        },
        messages: {
          noData: 'Nenhum feriado incluído.',
          noDataAfterFiltering: 'Nenhum feriado encontrado.'
        },
        // (optional) Override default labels. Useful for I18n.
        labels: {
          allCols: 'Todas as colunas',
          columns: 'Colunas',
          rows: 'Linhas',
          selected: {
            singular: 'item selecionado.',
            plural: 'item selecionado.'
          },
          clear: 'limpar',
          search: 'Pesquisar',
          all: 'Todas'
        }
      },
      columns: [
        {
          label: 'Data',
          field: 'data',
          width: '8em',
          filter: true,
          sort: true,
          type: 'date',
          format (value, row) {
            return moment(value).format('DD/MM/YYYY')
          }
        },
        {
          label: 'Descrição',
          field: 'descricao',
          filter: true,
          sort: true,
          type: 'string'
        },
        {
          label: 'Excluir',
          field: 'excluir',
          filter: false,
          width: '7em',
          type: 'string'
        }
      ]
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
    QItem,
    QDataTable
  },
  validations: {
    form: {
      data: { required },
      descricao: { required }
    }
  },
  methods: {
    submit () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        this.incluirFeriado(this.form)

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
        data: null,
        descricao: null
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
    // Gambiarra para resolver a falta de sort default, remover na v0.15 do quasar
    // Ref: https://github.com/quasarframework/quasar/issues/379
    document.querySelectorAll('.q-data-table-head table thead th')[0].click()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
@import '~variables'
.q-table
  width: 95vw

.q-data-table
  margin-bottom: 6em
</style>
