<script>
import { LocalStorage } from 'quasar'
import { Util } from './Util'
import moment from 'moment'

export default {

}
export const Feriados = {
  key: 'feriados',
  set: function (feriados) {
    LocalStorage.set(this.key, feriados)
  },
  get: function () {
    let feriados = LocalStorage.get.item(this.key)
    feriados = feriados || this.default.map(function (feriado) {
      feriado.id = Util.generateId()
      return feriado
    })
    this.set(feriados)
    return feriados
  },
  add: function (feriado) {
    feriado.id = Util.generateId()
    feriado.data = moment(feriado.data).format('YYYY-MM-DD')
    let feriados = this.get()
    feriados.push(feriado)
    this.set(feriados)
  },
  delete: function (id) {
    let feriados = this.get()
    let feriadosObj = this
    feriados.forEach(function (feriado, index) {
      if (feriado.id === id) {
        feriados.splice(index, 1)
        feriadosObj.set(feriados)
        return feriado
      }
    })
  },
  is: function (data) {
    return this.get().map(function (feriado) {
      return feriado.data
    }).includes(moment(data).format('YYYY-MM-DD'))
  },
  default: [
    {data: '2018-01-01', descricao: 'Confraternização Universal'},
    {data: '2018-02-12', descricao: 'Carnaval'},
    {data: '2018-02-13', descricao: 'Carnaval'},
    {data: '2018-03-30', descricao: 'Paixão de Cristo'},
    {data: '2018-04-21', descricao: 'Tiradentes'},
    {data: '2018-05-01', descricao: 'Dia do Trabalho'},
    {data: '2018-05-31', descricao: 'Corpus Christi'},
    {data: '2018-09-07', descricao: 'Independência do Brasil'},
    {data: '2018-10-12', descricao: 'Nossa Sr.a Aparecida - Padroeira do Brasil'},
    {data: '2018-11-02', descricao: 'Finados'},
    {data: '2018-11-15', descricao: 'Proclamação da República'},
    {data: '2018-12-25', descricao: 'Natal'},
    {data: '2019-01-01', descricao: 'Confraternização Universal'},
    {data: '2019-03-04', descricao: 'Carnaval'},
    {data: '2019-03-05', descricao: 'Carnaval'},
    {data: '2019-04-19', descricao: 'Paixão de Cristo'},
    {data: '2019-04-21', descricao: 'Tiradentes'},
    {data: '2019-05-01', descricao: 'Dia do Trabalho'},
    {data: '2019-06-20', descricao: 'Corpus Christi'},
    {data: '2019-09-07', descricao: 'Independência do Brasil'},
    {data: '2019-10-12', descricao: 'Nossa Sr.a Aparecida - Padroeira do Brasil'},
    {data: '2019-11-02', descricao: 'Finados'},
    {data: '2019-11-15', descricao: 'Proclamação da República'},
    {data: '2019-12-25', descricao: 'Natal'},
    {data: '2020-01-01', descricao: 'Confraternização Universal'},
    {data: '2020-02-24', descricao: 'Carnaval'},
    {data: '2020-02-25', descricao: 'Carnaval'},
    {data: '2020-04-10', descricao: 'Paixão de Cristo'},
    {data: '2020-04-21', descricao: 'Tiradentes'},
    {data: '2020-05-01', descricao: 'Dia do Trabalho'},
    {data: '2020-06-11', descricao: 'Corpus Christi'},
    {data: '2020-09-07', descricao: 'Independência do Brasil'},
    {data: '2020-10-12', descricao: 'Nossa Sr.a Aparecida - Padroeira do Brasil'},
    {data: '2020-11-02', descricao: 'Finados'},
    {data: '2020-11-15', descricao: 'Proclamação da República'},
    {data: '2020-12-25', descricao: 'Natal'}
  ]
}
</script>