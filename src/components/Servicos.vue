<template>
  <div class="servicos">
      <div id="app">
          <h5>Serviços</h5>
          <calendar-view
                  :show-date="showDate"
                  @click-event="abrirModalServico"
                  @setShowDate="setShowDate"
                  :events="events"
                  class=""
          />
      </div>

      <q-modal ref="escalaModal" :content-css="{minWidth: '50vw', minHeight: '55vh'}">
          <q-modal-layout>
              <q-toolbar slot="header">
                  <q-btn flat @click="$refs.escalaModal.close()">
                      <q-icon name="keyboard_arrow_left" />
                  </q-btn>
                  <div class="q-toolbar-title">
                      <span v-if="formEscala.id">Atualizar escala</span>
                      <span v-else>Adicionar escala</span>
                  </div>
              </q-toolbar>
              <div class="layout-padding">
                  <q-input v-model="formEscala.nome" float-label="Nome da pessoa"
                       @blur="$v.formEscala.nome.$touch"
                       @keyup.enter="submitEscala"
                       :error="$v.formEscala.nome.$error" />
                  <q-input v-model="formEscala.folga" type="number" float-label="Quantidade de dias de folga"
                           @blur="$v.formEscala.folga.$touch"
                           @keyup.enter="submitEscala"
                           :error="$v.formEscala.folga.$error"/>
                  <q-datetime v-model="formEscala.preta" type="date" float-label="Data da preta" format="DD/MM/YYYY"
                              @blur="$v.formEscala.preta.$touch"
                              @keyup.enter="submitEscala"
                              :error="$v.formEscala.preta.$error" />
                  <q-datetime v-model="formEscala.vermelha" type="date" float-label="Data da vermelha" format="DD/MM/YYYY"
                              @blur="$v.formEscala.vermelha.$touch"
                              @keyup.enter="submitEscala"
                              :error="$v.formEscala.vermelha.$error" />

                  <q-btn icon="add" color="primary" @click="submitEscala" class="full-width">
                      <span v-if="formEscala.id">Alterar escala</span>
                      <span v-else>Incluir escala</span>
                  </q-btn>
                  <q-btn icon="delete_forever" color="negative" v-if="formEscala.id" class="full-width margin-top">
                      <span >Excluir escala</span>
                      <q-popover ref="popover">
                          <q-list separator link>
                           <q-item @click="excluirEscala">
                               Sim, excluir esta escala!
                           </q-item>
                          </q-list>
                      </q-popover>
                  </q-btn>
              </div>
          </q-modal-layout>
      </q-modal>

      <q-modal ref="servicoModal" :content-css="{minWidth: '50vw', minHeight: '55vh'}">
          <q-modal-layout>
              <q-toolbar slot="header">
                  <q-btn flat @click="$refs.servicoModal.close()">
                      <q-icon name="keyboard_arrow_left" />
                  </q-btn>
                  <div class="q-toolbar-title">
                      <span>Atualizar serviço</span>
                  </div>
              </q-toolbar>
              <div class="layout-padding">
                  <q-input v-model="formServico.title" float-label="Nome da pessoa"
                       @blur="$v.formServico.title.$touch"
                       @keyup.enter="submitServico"
                       :error="$v.formServico.title.$error" />

                  <q-btn icon="add" color="primary" @click="submitServico" class="full-width">
                      <span>Alterar serviço</span>
                  </q-btn>
              </div>
          </q-modal-layout>
      </q-modal>

      <q-fixed-position v-if="escalas.get().length > 0" corner="bottom-right" :offset="[18, 90]">
          <q-btn round color="secondary" title="Atualizar serviços">
              <q-icon name="update" />
              <q-popover ref="popoverUpdateServico">
                  <q-list separator link>
                      <q-item @click="atualizarServicos">
                          Sim, atualizar serviços!
                      </q-item>
                  </q-list>
              </q-popover>
          </q-btn>
      </q-fixed-position>

      <q-fixed-position corner="bottom-right" :offset="[18, 18]">
          <q-btn round color="primary" @click="adicionarEscala" title="Adicionar escala">
              <q-icon name="add" />
          </q-btn>
      </q-fixed-position>
  </div>
</template>

<script>
import { QBtn, QIcon, QFixedPosition, QModal, QModalLayout, QToolbar, QInput, QDatetime, QFab, QPopover, QList, QItem } from 'quasar'
import { required } from 'vuelidate/lib/validators'
import { Feriados } from './model/Feriados'
import { Escalas } from './model/Escalas'
import { Servicos } from './model/Servicos'
import CalendarView from 'vue-simple-calendar'
require('vue-simple-calendar/dist/static/css/default.css')
require('vue-simple-calendar/dist/static/css/holidays-us.css')

export default {
  name: 'servicos',
  data: function () {
    return {
      showDate: new Date(),
      formEscala: {
        id: null,
        nome: null,
        folga: null,
        preta: null,
        vermelha: null
      },
      formServico: {
        id: null,
        escala_id: null,
        title: null,
        startDate: null,
        classes: null
      },
      escalas: Escalas,
      feriados: Feriados,
      servicos: Servicos,
      events: []
    }
  },
  components: {
    CalendarView,
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
    formEscala: {
      nome: { required },
      folga: { required },
      preta: { required },
      vermelha: { required }
    },
    formServico: {
      title: { required }
    }
  },
  methods: {
    setShowDate (d) {
      this.showDate = d
    },
    submitEscala () {
      this.$v.formEscala.$touch()
      if (!this.$v.formEscala.$error) {
        if (this.formEscala.id) {
          this.escalas.update(this.formEscala)
        }
        else {
          this.escalas.add(this.formEscala)
        }

        this.limparForm()
        this.$refs.escalaModal.close()
        this.events = this.servicos.get()
      }
    },
    submitServico () {
      this.$v.formServico.$touch()
      if (!this.$v.formServico.$error) {
        this.servicos.update(this.formServico)

        this.limparFormServico()
        this.$refs.servicoModal.close()
        this.events = this.servicos.get()
      }
    },
    excluirEscala () {
      this.escalas.delete(this.form.id)
      this.limparForm()
      this.$refs.escalaModal.close()
      this.events = this.servicos.get()
    },
    adicionarEscala () {
      this.limparForm()
      this.$refs.escalaModal.open()
    },
    alterarEscala (event) {
      this.form = this.escalas.getById(event.escala_id)
      this.$refs.escalaModal.open()
    },
    abrirModalServico (event) {
      this.formServico = Object.assign({}, event)
      this.$refs.servicoModal.open()
    },
    atualizarServicos () {
      this.servicos.calcularServicos()
      this.events = this.servicos.get()
      this.$refs.popoverUpdateServico.toggle()
    },
    limparForm () {
      this.form = {
        id: null,
        nome: null,
        folga: null,
        preta: null,
        vermelha: null
      }
    },
    limparFormServico () {
      this.formServico = {
        id: null,
        escala_id: null,
        title: null,
        startDate: null,
        classes: null
      }
    }
  },
  mounted () {
    this.events = this.servicos.get()
    this.feriados.get()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
@import '~variables'

.preta
  background-color: #2F353B !important
  color: #FFFFFF

.vermelha
  background-color: #D91E18 !important
  color: #FFFFFF

.margin-top
  margin-top: 0.5em

.nextYear, .previousYear
  display: none

.calendar-view
  margin-bottom: 6em
</style>
