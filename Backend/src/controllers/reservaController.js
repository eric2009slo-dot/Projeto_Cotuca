const ReservaCRUD = require("../model/reservaCRUD");
var db = require("../config/database");
const { tratarErro } = require("../utils/erros");
const { idInvalido, dataValida, horaValida } = require("../utils/validacoes");

// Confere os dados e devolve o texto do erro (ou null se estiver tudo certo)
function validarReserva(dados) {
  const obrigatorios = [
    "id_usuario", "id_recurso", "id_status",
    "data_inicial", "data_final", "hora_inicial", "hora_final"
  ];
  for (const campo of obrigatorios) {
    if (dados[campo] === undefined || dados[campo] === null || String(dados[campo]).trim() === "") {
      return "Campos obrigatórios: " + obrigatorios.join(", ") + ".";
    }
  }
  for (const campo of ["id_usuario", "id_recurso", "id_status"]) {
    if (!Number.isInteger(Number(dados[campo])) || Number(dados[campo]) <= 0) {
      return "O campo " + campo + " deve ser um número válido.";
    }
  }
  if (!dataValida(String(dados.data_inicial)) || !dataValida(String(dados.data_final))) {
    return "As datas devem estar no formato AAAA-MM-DD.";
  }
  if (!horaValida(String(dados.hora_inicial)) || !horaValida(String(dados.hora_final))) {
    return "As horas devem estar no formato HH:MM.";
  }
  // o fim precisa ser depois do início
  const inicio = dados.data_inicial + "T" + String(dados.hora_inicial).slice(0, 5);
  const fim = dados.data_final + "T" + String(dados.hora_final).slice(0, 5);
  if (fim <= inicio) {
    return "A data/hora final deve ser maior que a data/hora inicial.";
  }
  return null;
}

// Deixa os dados no formato certo antes de ir para o BD
function limparReserva(dados) {
  return {
    id_usuario: Number(dados.id_usuario),
    id_recurso: Number(dados.id_recurso),
    id_status: Number(dados.id_status),
    data_inicial: String(dados.data_inicial),
    data_final: String(dados.data_final),
    hora_inicial: String(dados.hora_inicial).slice(0, 5),
    hora_final: String(dados.hora_final).slice(0, 5)
  };
}

class ReservaController
{
  // GET /reservas   (todos os filtros são opcionais, via query string)
  // Exemplo: /reservas?codigo_recurso=LAB&data_inicial=2026-10-20&data_final=2026-10-25&id_status=4
  listarTodasReservas() {
    return async function (request, response) {
      const filtros = request.query || {};
      if (filtros.data_inicial && !dataValida(String(filtros.data_inicial))) {
        return response.status(400).json({ erro: "data_inicial deve estar no formato AAAA-MM-DD." });
      }
      if (filtros.data_final && !dataValida(String(filtros.data_final))) {
        return response.status(400).json({ erro: "data_final deve estar no formato AAAA-MM-DD." });
      }
      if (filtros.hora && !horaValida(String(filtros.hora))) {
        return response.status(400).json({ erro: "hora deve estar no formato HH:MM." });
      }
      for (const campo of ["id_recurso", "id_usuario", "id_status"]) {
        if (filtros[campo] && (!Number.isInteger(Number(filtros[campo])) || Number(filtros[campo]) <= 0)) {
          return response.status(400).json({ erro: campo + " deve ser um número válido." });
        }
      }
      try {
        const reservaCRUD = new ReservaCRUD(db);
        const resultados = await reservaCRUD.geraListagemDeReservas(filtros);
        response.json(resultados.recordset);
      } catch (erro) {
        tratarErro(response, erro, "Erro ao listar as RESERVAS!");
      }
    };
  }

  // GET /reservas/:id
  listarReservaPorID() {
    return async function (request, response) {
      const id = request.params.id;
      if (idInvalido(response, id)) return;
      try {
        const reservaCRUD = new ReservaCRUD(db);
        const resultados = await reservaCRUD.geraListagemDeReservaPorID(id);
        if (resultados.recordset.length === 0) {
          return response.status(404).json({ erro: "Reserva não encontrada." });
        }
        response.json(resultados.recordset[0]);
      } catch (erro) {
        tratarErro(response, erro, "Erro ao listar dados da RESERVA ID = " + id);
      }
    };
  }

  // POST /reservas
  inserirNovaReserva() {
    return async function (request, response) {
      const dados = request.body || {};
      const erroValidacao = validarReserva(dados);
      if (erroValidacao) {
        return response.status(400).json({ erro: erroValidacao });
      }
      try {
        const reserva = limparReserva(dados);
        const reservaCRUD = new ReservaCRUD(db);

        // não deixa reservar um recurso que já está tomado no período
        const conflito = await reservaCRUD.existeConflito(reserva, 0);
        if (conflito.recordset[0].total > 0) {
          return response.status(409).json({
            erro: "Este recurso já está reservado, ocupado ou bloqueado nesse período."
          });
        }

        const resultados = await reservaCRUD.insereReserva(reserva);
        response.status(201).json({ id: resultados.recordset[0].id });
      } catch (erro) {
        tratarErro(response, erro, "Erro ao inserir nova RESERVA no BD!");
      }
    };
  }

  // PUT /reservas/:id
  atualizarDadosReserva() {
    return async function (request, response) {
      const id = request.params.id;
      if (idInvalido(response, id)) return;
      const dados = request.body || {};
      const erroValidacao = validarReserva(dados);
      if (erroValidacao) {
        return response.status(400).json({ erro: erroValidacao });
      }
      try {
        const reserva = limparReserva(dados);
        const reservaCRUD = new ReservaCRUD(db);

        // ignora a própria reserva na checagem de conflito
        const conflito = await reservaCRUD.existeConflito(reserva, id);
        if (conflito.recordset[0].total > 0) {
          return response.status(409).json({
            erro: "Este recurso já está reservado, ocupado ou bloqueado nesse período."
          });
        }

        const resultados = await reservaCRUD.atualizaReserva(id, reserva);
        if (resultados.rowsAffected[0] === 0) {
          return response.status(404).json({ erro: "Reserva não encontrada." });
        }
        response.json({ id: Number(id) });
      } catch (erro) {
        tratarErro(response, erro, "Erro ao atualizar dados da RESERVA no BD!");
      }
    };
  }

  // DELETE /reservas/:id
  excluirReservaPorID() {
    return async function (request, response) {
      const id = request.params.id;
      if (idInvalido(response, id)) return;
      try {
        const reservaCRUD = new ReservaCRUD(db);
        const resultados = await reservaCRUD.excluiReservaPorID(id);
        if (resultados.rowsAffected[0] === 0) {
          return response.status(404).json({ erro: "Reserva não encontrada." });
        }
        response.json({ mensagem: "Reserva excluída com sucesso." });
      } catch (erro) {
        tratarErro(response, erro, "Erro ao excluir RESERVA ID = " + id);
      }
    };
  }
}  // end da class ReservaController

module.exports = ReservaController;