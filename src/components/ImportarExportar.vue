<template>
  <div class="importar-exportar">
      <div id="app">
          <div class="row xl-gutter">
              <div class="col-md-6">
                  <h5>
                      Importar
                      <small class="aviso-importacao">Todas as suas informações serão sobreescritas</small>
                  </h5>
                  <q-input
                      v-model="form.imp"
                      @keyup.enter="submit"
                      :error="$v.form.imp.$error"
                      float-label="Cole o código no campo abaixo"
                      type="textarea"
                      :min-rows="10"
                      :max-height="100"
                  />

                  <q-btn icon="file_download" color="primary" @click="submit" class="full-width">
                      Importar informações
                  </q-btn>
              </div>

              <div class="col-md-6">
                  <h5>Exportar</h5>
                  <q-input
                      v-model="exp"
                      float-label="Copie o código abaixo"
                      type="textarea"
                      :min-rows="10"
                      :disable="true"
                      :readonly="true"
                  />
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import { QInput, QBtn, Toast } from 'quasar'
import { required } from 'vuelidate/lib/validators'
import { Feriados } from './model/Feriados'
import { Escalas } from './model/Escalas'

export default {
  name: 'importar-exportar',
  data: function () {
    return {
      exp: '',
      form: {
        imp: ''
      },
      escalas: Escalas,
      feriados: Feriados,
      events: []
    }
  },
  components: {
    QInput,
    QBtn
  },
  validations: {
    form: {
      imp: { required }
    }
  },
  methods: {
    exportar () {
      return btoa(JSON.stringify({
        escalas: Escalas.get(),
        feriados: Feriados.get()
      }))
    },
    importar (exp) {
      try {
        let imp = JSON.parse(atob(exp.trim()))
        console.log(imp)
        if (imp.escalas && imp.feriados) {
          Escalas.set(imp.escalas)
          Feriados.set(imp.feriados)

          return true
        }
      }
      catch (err) {
        console.error(err)
      }

      return false
    },
    submit () {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        return false
      }

      if (this.importar(this.form.imp)) {
        this.form.imp = ''
        Toast.create.positive({
          html: 'Informações importadas com sucesso.'
        })
      }
      else {
        Toast.create.negative({
          html: 'Erro ao tentar importar o código informado.'
        })
      }
    }
  },
  mounted () {
    this.exp = this.exportar()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
@import '~variables'
.aviso-importacao
    font-size: 50%
    color: red
</style>
