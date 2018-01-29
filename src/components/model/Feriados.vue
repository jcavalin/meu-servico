<script>
import { LocalStorage } from 'quasar'
import moment from 'moment'

export default {

}
export const Feriados = {
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
    LocalStorage.set('feriados', feriados)
    return feriados
  },
  add: function (feriado) {
    let feriados = this.get()
    feriados.push(moment(feriado).format('YYYY-MM-DD'))
    LocalStorage.set('feriados', feriados)
  },
  delete: function (feriado) {
    let feriados = this.get()
    feriados.splice(feriados.indexOf(feriado), 1)
    LocalStorage.set('feriados', feriados)
  },
  is: function (data) {
    return this.get().includes(moment(data).format('YYYY-MM-DD'))
  }
}
</script>