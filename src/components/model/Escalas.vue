<script>
import { LocalStorage } from 'quasar'

export default {

}
export const Escalas = {
  key: 'escalas',
  set: function (escalas) {
    LocalStorage.set(this.key, escalas)
  },
  get: function () {
    let escalas = LocalStorage.get.item(this.key)
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
    this.set(escalas)
  },
  update: function (escalaUpdate) {
    let escalas = this.get()
    escalas.forEach(function (escala, index) {
      if (escala.id === escalaUpdate.id) {
        escalas[index] = escalaUpdate
        this.set(escalas)
        return escala
      }
    })
  },
  delete: function (id) {
    let escalas = this.get()
    let escalasObj = this
    escalas.forEach(function (escala, index) {
      if (escala.id === id) {
        escalas.splice(index, 1)
        escalasObj.set(escalas)
        return escala
      }
    })
  }
}
</script>