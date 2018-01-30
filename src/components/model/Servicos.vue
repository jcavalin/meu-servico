<script>
import { LocalStorage } from 'quasar'
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
    servicos = servicos || []
    return servicos
  },
  getById: function (id) {
    let servicoEncontrado = null
    this.get().forEach(function (servico) {
      if (servico.id === id) {
        servicoEncontrado = servico
        return servicoEncontrado
      }
    })

    return servicoEncontrado
  },
  add: function (servico) {
    servico.id = Util.generateId()
    servico.grupo = servico.grupo || servico.id
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
  calcularProximosServicos (servico) {
    let calcularProximoServico = this.calcularProximoServico
    let servicos = this.get()

    let montarServico = function (servico, data) {
      return {
        id: Util.generateId(),
        grupo: servico.grupo,
        title: servico.title,
        folga: servico.folga,
        startDate: data,
        classes: servico.classes
      }
    }

    let ultimoServico = servico
    while (moment().add(1, 'years').isAfter(ultimoServico.startDate)) {
      ultimoServico = montarServico(ultimoServico, calcularProximoServico(ultimoServico))
      servicos.push(ultimoServico)
    }

    this.set(servicos)
    return servicos
  },
  calcularProximoServico (servico) {
    let calcularPreta = function (servico) {
      let qtdDias = 1
      let dataAtual = moment(servico.startDate).add(1, 'days')

      while (qtdDias <= servico.folga || Util.isWeekendOrHoliday(dataAtual)) {
        if (!Util.isWeekendOrHoliday(dataAtual)) {
          qtdDias++
        }

        dataAtual = moment(dataAtual).add(1, 'days')
      }

      return dataAtual.toDate()
    }

    let calcularVermelha = function (servico) {
      let qtdDias = 1
      let dataAtual = moment(servico.startDate).add(1, 'days')

      while (qtdDias <= servico.folga || !Util.isWeekendOrHoliday(dataAtual)) {
        if (Util.isWeekendOrHoliday(dataAtual)) {
          qtdDias++
        }

        dataAtual = moment(dataAtual).add(1, 'days')
      }

      return dataAtual.toDate()
    }

    let dataProximoServico = null
    switch (servico.classes) {
      case 'preta' :
        dataProximoServico = calcularPreta(servico)
        break
      case 'vermelha' :
        dataProximoServico = calcularVermelha(servico)
        break
    }

    return dataProximoServico
  },
  atualizarProximosServicos (servico) {
    let servicosObj = this
    let ultimoServico = servico

    this.get().map(function (proximoServico) {
      if (servicosObj.isProximoServico(servico, proximoServico)) {
        proximoServico.startDate = servicosObj.calcularProximoServico(ultimoServico)
        servicosObj.update(proximoServico)

        ultimoServico = proximoServico
      }
    })

    // Adiciona os serviços restantes
    servico.startDate = ultimoServico.startDate
    this.calcularProximosServicos(servico)
  },
  excluirProximos (servico) {
    let servicosObj = this

    this.get().map(function (proximoServico) {
      if (servicosObj.isProximoServico(servico, proximoServico)) {
        servicosObj.delete(proximoServico.id)
      }
    })
  },
  isProximoServico (servicoAnterior, servicoPosterior) {
    return servicoPosterior.id !== servicoAnterior.id && servicoPosterior.grupo === servicoAnterior.grupo &&
      moment(servicoPosterior.startDate).isAfter(servicoAnterior.startDate)
  }
}
</script>