<script>
import moment from 'moment'
import { Feriados } from './Feriados'
export default {

}
export const Util = {
  generateId: function () {
    return Math.floor(Math.random() * 999999999) + 1
  },
  isWeekendOrHoliday: function (data) {
    let diaSemana = moment(data).weekday()
    return diaSemana === 0 || diaSemana === 6 || Feriados.is(data)
  }
}
</script>