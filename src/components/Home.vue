<template>
  <div class="home">
      <div id="app">
          <h4>Serviços</h4>
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

      <q-fixed-position corner="bottom-right" :offset="[18, 18]">
          <q-btn round color="primary" @click="$refs.escalaModal.open()" title="Adicionar escala">
              <q-icon name="add" />
          </q-btn>
      </q-fixed-position>
  </div>
</template>

<script>
import { QBtn, QIcon, QFixedPosition, QModal, QModalLayout, QToolbar, QInput, QDatetime, QFab, LocalStorage } from 'quasar'
import { required } from 'vuelidate/lib/validators'
import moment from 'moment'
import CalendarView from 'vue-simple-calendar'
require('vue-simple-calendar/dist/static/css/default.css')
require('vue-simple-calendar/dist/static/css/holidays-us.css')

export default {
  name: 'home',
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
      feriados: {
        get: function () {
          let feriados = LocalStorage.get.item('feriados')
          feriados = feriados || [
            '2018-01-01', '2018-02-12', '2018-02-13', '2018-03-30', '2018-04-21', '2018-05-01', '2018-05-31',
            '2018-09-07', '2018-10-12', '2018-11-02', '2018-11-15', '2018-12-25', '2019-01-01', '2019-03-04',
            '2019-03-05', '2019-04-19', '2019-04-21', '2019-05-01', '2019-06-20', '2019-09-07', '2019-10-12',
            '2019-11-02', '2019-11-15', '2019-12-25', '2020-01-01', '2020-02-24', '2020-02-25', '2020-04-10',
            '2020-04-21', '2020-05-01', '2020-06-11', '2020-09-07', '2020-10-12', '2020-11-02', '2020-11-15',
            '2020-12-25'
          ]
          return feriados
        },
        add: function (feriado) {
          let feriados = this.get()
          feriados.push(feriado)
          LocalStorage.set('feriados', feriados)
        },
        is: function (data) {
          return this.get().includes(moment(data).format('YYYY-MM-DD'))
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
    QDatetime,
    QFab
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
    },
    alterarEscala (event) {
      console.log(event)
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

#app
  width: 95vw
  min-width: 30em
  max-width: 100em
  margin-left: auto
  margin-right: auto
  display: flex
  max-height: 100vh
  flex-direction: column
</style>
