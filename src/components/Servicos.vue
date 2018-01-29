<template>
  <div class="servicos">
      <div id="app">
          <h5>Serviços</h5>
          <calendar-view
                  :show-date="showDate"
                  @click-event="alterarEscala"
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
                      <span v-if="form.id">Atualizar escala</span>
                      <span v-else>Adicionar escala</span>
                  </div>
              </q-toolbar>
              <div class="layout-padding">
                  <q-input v-model="form.nome" float-label="Nome da pessoa"
                       @blur="$v.form.nome.$touch"
                       @keyup.enter="submit"
                       :error="$v.form.nome.$error" />
                  <q-input v-model="form.folga" type="number" float-label="Quantidade de dias de folga"
                           @blur="$v.form.folga.$touch"
                           @keyup.enter="submit"
                           :error="$v.form.folga.$error"/>
                  <q-datetime v-model="form.preta" type="date" float-label="Data da preta" format="DD/MM/YYYY"
                              @blur="$v.form.preta.$touch"
                              @keyup.enter="submit"
                              :error="$v.form.preta.$error" />
                  <q-datetime v-model="form.vermelha" type="date" float-label="Data da vermelha" format="DD/MM/YYYY"
                              @blur="$v.form.vermelha.$touch"
                              @keyup.enter="submit"
                              :error="$v.form.vermelha.$error" />

                  <q-btn icon="add" color="primary" @click="submit" class="full-width">
                      <span v-if="form.id">Alterar escala</span>
                      <span v-else>Incluir escala</span>
                  </q-btn>
                  <q-btn icon="delete_forever" color="negative" v-if="form.id" class="full-width margin-top">
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
import moment from 'moment'
import CalendarView from 'vue-simple-calendar'
require('vue-simple-calendar/dist/static/css/default.css')
require('vue-simple-calendar/dist/static/css/holidays-us.css')

export default {
  name: 'servicos',
  data: function () {
    return {
      showDate: new Date(),
      form: {
        id: null,
        nome: null,
        folga: null,
        preta: null,
        vermelha: null
      },
      escalas: Escalas,
      feriados: Feriados,
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
    form: {
      nome: { required },
      folga: { required },
      preta: { required },
      vermelha: { required }
    }
  },
  methods: {
    setShowDate (d) {
      this.showDate = d
    },
    submit () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        if (this.form.id) {
          this.atualizarEscala(this.form)
        }
        else {
          this.incluirEscala(this.form)
        }

        this.limparForm()
        this.$refs.escalaModal.close()
        this.events = this.recuperarEventos()
      }
    },
    excluirEscala () {
      this.escalas.delete(this.form.id)
      this.limparForm()
      this.$refs.escalaModal.close()
      this.events = this.recuperarEventos()
    },
    incluirEscala (escala) {
      this.escalas.add(escala)
    },
    atualizarEscala (escala) {
      this.escalas.update(escala)
    },
    calcularEscalas () {
      let calcularEscala = this.calcularEscala
      let escalas = this.escalas.get()
      let escalasCalculadas = []

      escalas.map(function (escala, indice) {
        if (escala.nome) {
          let escalaCalculada = escala
          escalasCalculadas.push(escalaCalculada)

          while (moment().add(1, 'years').isAfter(escalaCalculada.preta)) {
            let datasEscala = calcularEscala(escalaCalculada)
            escalaCalculada = {
              id: escala.id,
              nome: escala.nome,
              folga: escala.folga,
              preta: datasEscala.preta,
              vermelha: datasEscala.vermelha
            }

            escalasCalculadas.push(escalaCalculada)
          }
        }
      })

      return escalasCalculadas
    },
    calcularEscala (escala) {
      let feriados = this.feriados
      let calcularPreta = function (escala) {
        let qtdDias = 1
        let dataAtual = moment(escala.preta).add(1, 'days')
        let diaSemana = dataAtual.weekday()

        while (qtdDias <= escala.folga || diaSemana === 0 || diaSemana === 6 || feriados.is(dataAtual)) {
          if (diaSemana !== 0 && diaSemana !== 6 && !feriados.is(dataAtual)) {
            qtdDias++
          }

          dataAtual = moment(dataAtual).add(1, 'days')
          diaSemana = dataAtual.weekday()
        }

        return dataAtual.toDate()
      }

      let calcularVermelha = function (escala) {
        let qtdDias = 1
        let dataAtual = moment(escala.vermelha).add(1, 'days')
        let diaSemana = dataAtual.weekday()
        while (qtdDias <= escala.folga || (diaSemana !== 0 && diaSemana !== 6 && !feriados.is(dataAtual))) {
          if (diaSemana === 0 || diaSemana === 6 || feriados.is(dataAtual)) {
            qtdDias++
          }

          dataAtual = moment(dataAtual).add(1, 'days')
          diaSemana = dataAtual.weekday()
        }

        return dataAtual.toDate()
      }

      return {
        preta: calcularPreta(escala),
        vermelha: calcularVermelha(escala)
      }
    },
    recuperarEventos () {
      let eventos = []
      this.calcularEscalas().forEach(function (escala) {
        eventos.push({
          escala_id: escala.id,
          title: escala.nome,
          startDate: escala.preta,
          classes: 'preta'
        })

        eventos.push({
          escala_id: escala.id,
          title: escala.nome,
          startDate: escala.vermelha,
          classes: 'vermelha'
        })
      })

      return eventos
    },
    adicionarEscala () {
      this.limparForm()
      this.$refs.escalaModal.open()
    },
    alterarEscala (event) {
      this.form = this.escalas.getById(event.escala_id)
      this.$refs.escalaModal.open()
    },
    limparForm () {
      this.form = {
        id: null,
        nome: null,
        folga: null,
        preta: null,
        vermelha: null
      }
    }
  },
  mounted () {
    this.events = this.recuperarEventos()
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
