<script>
import { LocalStorage } from 'quasar'

export default {

}
export const Escalas = {
  get: function () {
    let escalas = LocalStorage.get.item('escalas')
    escalas = escalas || []
    return escalas
  },
  getById: function (id) {
    let escalaEncontrada = null
    this.get().forEach(function (escala) {
      if (escala.id === id) {
        escalaEncontrada = escala
        return escalaEncontrada
      }
    })

    return escalaEncontrada
  },
  add: function (escala) {
    escala.id = Math.floor(Math.random() * (999999999 - 1 + 1)) + 1
    let escalas = this.get()
    escalas.push(escala)
    LocalStorage.set('escalas', escalas)
  },
  update: function (escalaUpdate) {
    let escalas = this.get()
    escalas.forEach(function (escala, index) {
      if (escala.id === escalaUpdate.id) {
        escalas[index] = escalaUpdate
        LocalStorage.set('escalas', escalas)
        return escala
      }
    })
  },
  delete: function (escala) {
    let escalas = this.get()
    escalas.splice(escalas.indexOf(escala), 1)
    LocalStorage.set('escalas', escalas)
  }
}
</script>