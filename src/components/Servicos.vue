<template>
  <div class="servicos">
      <div id="app">
          <h5>Serviços</h5>
          <calendar-view
                  :show-date="showDate"
                  @click-event="abrirModalServico"
                  @click-date="abrirModalServicoDia"
                  @setShowDate="setShowDate"
                  :events="events"
                  class=""
          />
      </div>

      <q-modal ref="servicoModal" :content-css="{minWidth: '50vw', minHeight: '55vh'}">

          <q-modal-layout>
              <q-toolbar slot="header">
                  <q-btn flat @click="$refs.servicoModal.close()">
                      <q-icon name="keyboard_arrow_left" />
                  </q-btn>
                  <div class="q-toolbar-title">
                      <span v-if="formServico.id">Atualizar serviço</span>
                      <span v-else>Adicionar serviço</span>
                  </div>
              </q-toolbar>
              <div class="layout-padding">
                  <q-input v-model="formServico.title" float-label="Nome da pessoa"
                       @blur="$v.formServico.title.$touch"
                       @keyup.enter="submitServico"
                       :error="$v.formServico.title.$error" />
                  <q-input v-model="formServico.folga" type="number" float-label="Quantidade de dias de folga"
                           @blur="$v.formServico.folga.$touch"
                           @keyup.enter="submitServico"
                           :error="$v.formServico.folga.$error"/>
                  <q-datetime v-model="formServico.startDate" type="date" float-label="Data" format="DD/MM/YYYY"
                              @blur="$v.formServico.startDate.$touch"
                              @keyup.enter="submitServico"
                              :error="$v.formServico.startDate.$error" />

                  <q-select
                          v-model="formServico.classes"
                          float-label="Tipo"
                          @blur="$v.formServico.classes.$touch"
                          @keyup.enter="submitServico"
                          :error="$v.formServico.classes.$error"
                          :options="tiposServico"
                  />

                  <q-select
                          v-model="formServico.calcularProximos"
                          v-if="formServico.id"
                          float-label="Alterar próximos serviços?"
                          @keyup.enter="submitServico"
                          :options="tiposSimNao"
                  />

                  <q-select
                          v-model="formServico.calcularProximos"
                          v-else="formServico.id"
                          float-label="Calcular próximos serviços?"
                          @keyup.enter="submitServico"
                          :options="tiposSimNao"
                  />

                  <q-btn icon="add" color="primary" @click="submitServico" class="full-width">
                      <span v-if="formServico.id">Alterar serviço</span>
                      <span v-else>Incluir serviço</span>
                  </q-btn>
                  <q-btn icon="delete_forever" color="negative" v-if="formServico.id" class="full-width margin-top">
                      <span >Excluir serviço</span>
                      <q-popover ref="popover">
                          <q-list separator link>
                           <q-item @click="excluirServico">
                               Sim, excluir este serviço!
                           </q-item>
                           <q-item @click="excluirProximosServico">
                               Sim, excluir este e os próximos serviços!
                           </q-item>
                          </q-list>
                      </q-popover>
                  </q-btn>
              </div>
          </q-modal-layout>
      </q-modal>

      <q-fixed-position corner="bottom-right" :offset="[18, 18]">
          <q-btn round color="primary" @click="abrirModalServico(null)" title="Adicionar serviço">
              <q-icon name="add" />
          </q-btn>
      </q-fixed-position>
  </div>
</template>

<script>
import { QBtn, QIcon, QFixedPosition, QModal, QModalLayout, QToolbar, QInput, QDatetime, QFab, QPopover, QList, QItem, QSelect, Loading } from 'quasar'
import { required } from 'vuelidate/lib/validators'
import { Feriados } from './model/Feriados'
import { Servicos } from './model/Servicos'
import { Util } from './model/Util'
import CalendarView from 'vue-simple-calendar'
require('vue-simple-calendar/dist/static/css/default.css')
require('vue-simple-calendar/dist/static/css/holidays-us.css')

export default {
  name: 'servicos',
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
    QItem,
    QSelect,
    Loading
  },
  data: function () {
    return {
      showDate: new Date(),
      formServico: {
        id: null,
        title: null,
        folga: null,
        startDate: null,
        classes: null,
        calcularProximos: false
      },
      events: [],
      tiposServico: [
        {
          label: 'Preta',
          value: 'preta'
        },
        {
          label: 'Vermelha',
          value: 'vermelha'
        }
      ],
      tiposSimNao: [
        {
          label: 'Sim',
          value: true
        },
        {
          label: 'Não',
          value: false
        }
      ]
    }
  },
  validations: {
    formServico: {
      title: { required },
      folga: { required },
      startDate: { required },
      classes: { required }
    }
  },
  methods: {
    setShowDate (d) {
      this.showDate = d
    },
    submitServico () {
      this.$v.formServico.$touch()
      Loading.show()

      let formServico = Object.assign({}, this.formServico)
      let objRef = this
      let done = function () {
        Loading.hide()
        objRef.limparForm()
        objRef.$refs.servicoModal.close()
        objRef.events = Servicos.get()
      }

      if (!this.$v.formServico.$error) {
        if (formServico.id) {
          Servicos.update(formServico)
          if (formServico.calcularProximos) {
            setTimeout(function () {
              Servicos.atualizarProximosServicos(formServico)
              done()
            }, 515)
          }
        }
        else {
          Servicos.add(formServico)
          if (formServico.calcularProximos) {
            setTimeout(function () {
              Servicos.calcularProximosServicos(formServico)
              done()
            }, 515)
          }
        }

        if (!formServico.calcularProximos) {
          done()
        }
      }
    },
    excluirServico () {
      Servicos.delete(this.formServico.id)
      this.limparForm()
      this.$refs.servicoModal.close()
      this.events = Servicos.get()
    },
    excluirProximosServico () {
      Servicos.delete(this.formServico.id)
      Servicos.excluirProximos(this.formServico)
      this.limparForm()
      this.$refs.servicoModal.close()
      this.events = Servicos.get()
    },
    abrirModalServico (servico) {
      this.limparForm()

      if (servico) {
        this.formServico = Object.assign({}, servico)
        this.formServico.calcularProximos = false
      }
      this.$refs.servicoModal.open()
    },
    abrirModalServicoDia (data) {
      this.limparForm()
      this.formServico.classes = Util.isWeekendOrHoliday(data) ? 'vermelha' : 'preta'
      this.formServico.startDate = data

      this.$refs.servicoModal.open()
    },
    limparForm () {
      this.formServico = {
        id: null,
        title: null,
        folga: null,
        startDate: null,
        classes: null,
        calcularProximos: false
      }
    }
  },
  mounted () {
    this.events = Servicos.get()
    Feriados.get()
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

.calendar-view .week
  min-height: 6em !important
.q-loading
  z-index: 9999
</style>
