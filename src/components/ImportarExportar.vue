<template>
  <div class="importar-exportar">
      <div id="app">
          <div class="row md-gutter">
              <div class="col-md-6">
                  <h5>
                      Importar
                  </h5>
                  <q-input
                      v-model="form.imp"
                      @keyup.enter="submit"
                      :error="$v.form.imp.$error"
                      float-label="Cole o código no campo abaixo"
                      type="textarea"
                      :min-rows="3"
                      :max-height="100"
                  />
                  <q-btn icon="file_download" color="primary" @click="submit" class="full-width">
                      Importar informações
                  </q-btn>
                  <div class="aviso-importacao">
                      Atenção! Todas as suas informações serão substituídas.
                  </div>
              </div>

              <div class="col-md-6">
                  <h5>Exportar</h5>
                  <q-btn icon="content_copy" color="primary" class="full-width" v-clipboard:copy="exp" v-clipboard:success="onCodeCopy" v-clipboard:error="onErrorCopy">
                      Copiar código
                  </q-btn>
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
import { Servicos } from './model/Servicos'

export default {
  name: 'importar-exportar',
  data: function () {
    return {
      exp: '',
      form: {
        imp: ''
      },
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
      return (JSON.stringify({
        feriados: Feriados.get(),
        servicos: Servicos.get()
      }))
    },
    importar (exp) {
      try {
        let imp = JSON.parse((exp.trim()))

        if (imp.feriados && imp.servicos) {
          Feriados.set(imp.feriados)
          Servicos.set(imp.servicos)

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
    },
    onCodeCopy () {
      Toast.create.positive({
        html: 'Código copiado.'
      })
    },
    onErrorCopy () {
      Toast.create.negative({
        html: 'Erro ao tentar copiar o código.'
      })
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
    color: red
    font-size: 80%
    padding: 0.5em 0
    text-align: center
</style>
