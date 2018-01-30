<script>
import { LocalStorage } from 'quasar'
import { Escalas } from './Escalas'
import { Feriados } from './Feriados'
import { Util } from './Util'
import moment from 'moment'

export default {

}
export const Servicos = {
  key: 'servicos',
  set: function (servicos) {
    LocalStorage.set(this.key, servicos)
  },
  get: function () {
    let servicos = LocalStorage.get.item(this.key)
    servicos = servicos || this.calcularServicos()
    return servicos
  },
  getById: function (id) {
    let servicoEncontrada = null
    this.get().forEach(function (servico) {
      if (servico.id === id) {
        servicoEncontrada = servico
        return servicoEncontrada
      }
    })

    return servicoEncontrada
  },
  add: function (servico) {
    servico.id = Util.generateId()
    let servicos = this.get()
    servicos.push(servico)
    this.set(servicos)
  },
  update: function (servicoUpdate) {
    let servicos = this.get()
    let servicosObj = this
    servicos.forEach(function (servico, index) {
      if (servico.id === servicoUpdate.id) {
        servicos[index] = servicoUpdate
        servicosObj.set(servicos)
        return servico
      }
    })
  },
  delete: function (id) {
    let servicos = this.get()
    let servicosObj = this
    servicos.forEach(function (servico, index) {
      if (servico.id === id) {
        servicos.splice(index, 1)
        servicosObj.set(servicos)
        return servico
      }
    })
  },
  calcularServicos () {
    let calcularServico = this.calcularServico
    let escalas = Escalas.get()
    let servicos = []

    escalas.map(function (escala) {
      let montarServico = function (escala, data, tipo) {
        return {
          id: Util.generateId(),
          escala_id: escala.id,
          title: escala.nome,
          startDate: data,
          classes: tipo
        }
      }

      if (escala.nome) {
        let ultimaEscala = escala
        servicos.push(montarServico(ultimaEscala, new Date(ultimaEscala.preta), 'preta'))
        servicos.push(montarServico(ultimaEscala, new Date(ultimaEscala.vermelha), 'vermelha'))

        while (moment().add(1, 'years').isAfter(ultimaEscala.preta)) {
          let datasServico = calcularServico(ultimaEscala)

          servicos.push(montarServico(ultimaEscala, datasServico.preta, 'preta'))
          servicos.push(montarServico(ultimaEscala, datasServico.vermelha, 'vermelha'))

          ultimaEscala.preta = datasServico.preta
          ultimaEscala.vermelha = datasServico.vermelha
        }
      }
    })

    this.set(servicos)
    return servicos
  },
  calcularServico (escala) {
    let calcularPreta = function (escala) {
      let qtdDias = 1
      let dataAtual = moment(escala.preta).add(1, 'days')
      let diaSemana = dataAtual.weekday()

      while (qtdDias <= escala.folga || diaSemana === 0 || diaSemana === 6 || Feriados.is(dataAtual)) {
        if (diaSemana !== 0 && diaSemana !== 6 && !Feriados.is(dataAtual)) {
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
      while (qtdDias <= escala.folga || (diaSemana !== 0 && diaSemana !== 6 && !Feriados.is(dataAtual))) {
        if (diaSemana === 0 || diaSemana === 6 || Feriados.is(dataAtual)) {
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
  }
}
</script>