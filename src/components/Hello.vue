<template>
  <div class="hello">
      <q-btn round color="primary" @click="$refs.escalaModal.open()">
          <q-icon name="add" />
      </q-btn>
      <div id="app">
          <calendar-view
                  :show-date="showDate"
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
                      Adicionar escala
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
                  <q-datetime v-model="form.preta" type="date" float-label="Data da última preta" format="DD/MM/YYYY"
                              @blur="$v.form.preta.$touch"
                              @keyup.enter="submit"
                              :error="$v.form.preta.$error" />
                  <q-datetime v-model="form.vermelha" type="date" float-label="Data da última vermelha" format="DD/MM/YYYY"
                              @blur="$v.form.vermelha.$touch"
                              @keyup.enter="submit"
                              :error="$v.form.vermelha.$error" />

                  <q-btn icon="add" color="primary" @click="submit" class="full-width">Incluir escala</q-btn>
              </div>
          </q-modal-layout>
      </q-modal>
  </div>
</template>

<script>
import { QBtn, QIcon, QFixedPosition, QModal, QModalLayout, QToolbar, QInput, QDatetime, LocalStorage } from 'quasar'
import { required } from 'vuelidate/lib/validators'
import moment from 'moment'
import CalendarView from 'vue-simple-calendar'
require('vue-simple-calendar/dist/static/css/default.css')
require('vue-simple-calendar/dist/static/css/holidays-us.css')

export default {
  name: 'hello',
  data: function () {
    return {
      showDate: new Date(),
      form: {
        nome: null,
        folga: null,
        preta: null,
        vermelha: null
      },
      escalas: {
        get: function () {
          let escalas = LocalStorage.get.item('escalas')
          escalas = escalas || []
          return escalas
        },
        add: function (escala) {
          let escalas = this.get()
          escalas.push(escala)
          LocalStorage.set('escalas', escalas)
        }
      },
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
    QDatetime
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
        this.incluirEscala(this.form)

        this.form.nome = ''
        this.form.folga = ''
        this.form.preta = ''
        this.form.vermelha = ''
        this.$refs.escalaModal.close()

        this.events = this.recuperarEventos()
      }
    },
    incluirEscala (escala) {
      this.escalas.add(escala)
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
            console.log(escalaCalculada.preta, moment().add(1, 'years').toDate())
            let datasEscala = calcularEscala(escalaCalculada)
            escalaCalculada = {
              id: indice,
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
      let calcularPreta = function (escala) {
        let qtdDias = 1
        let dataAtual = moment(escala.preta).add(1, 'days')
        let diaSemana = dataAtual.weekday()
        while (qtdDias <= escala.folga || diaSemana === 0 || diaSemana === 6) {
          if (diaSemana !== 0 && diaSemana !== 6) {
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
        while (qtdDias <= escala.folga || (diaSemana !== 0 && diaSemana !== 6)) {
          if (diaSemana === 0 || diaSemana === 6) {
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
          title: escala.nome,
          startDate: escala.preta,
          classes: 'preta'
        })

        eventos.push({
          title: escala.nome,
          startDate: escala.vermelha,
          classes: 'vermelha'
        })
      })

      return eventos
    }
  },
  mounted () {
    this.events = this.recuperarEventos()
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
</style>
