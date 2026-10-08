const StatusCRUD = require("../model/statusCRUD");
var db = require("../config/database");
const { tratarErro } = require("../utils/erros");
const { idInvalido } = require("../utils/validacoes");

class StatusController
{
  // GET /status
  listarTodosStatus() {
    return async function (request, response) {
      try {
        const statusCRUD = new StatusCRUD(db);
        const resultados = await statusCRUD.geraListagemDeStatus();
        response.json(resultados.recordset);
      } catch (erro) {
        tratarErro(response, erro, "Erro ao listar TODOS os STATUS!");
      }
    };
  }

  // GET /status/:id
  listarStatusPorID() {
    return async function (request, response) {
      const id = request.params.id;
      if (idInvalido(response, id)) return;
      try {
        const statusCRUD = new StatusCRUD(db);
        const resultados = await statusCRUD.geraListagemDeStatusPorID(id);
        if (resultados.recordset.length === 0) {
          return response.status(404).json({ erro: "Status não encontrado." });
        }
        response.json(resultados.recordset[0]);
      } catch (erro) {
        tratarErro(response, erro, "Erro ao listar dados do STATUS ID = " + id);
      }
    };
  }

  // POST /status   body: { "nome": "Livre" }
  inserirNovoStatus() {
    return async function (request, response) {
      const dados = request.body || {};
      if (!dados.nome || !String(dados.nome).trim()) {
        return response.status(400).json({ erro: "O campo nome é obrigatório." });
      }
      try {
        const statusCRUD = new StatusCRUD(db);
        const resultados = await statusCRUD.insereStatus(dados);
        response.status(201).json({
          id: resultados.recordset[0].id,
          nome: String(dados.nome).trim()
        });
      } catch (erro) {
        tratarErro(response, erro, "Erro ao inserir novo STATUS no BD!");
      }
    };
  }

  // PUT /status/:id   body: { "nome": "Bloqueado" }
  atualizarStatus() {
    return async function (request, response) {
      const id = request.params.id;
      if (idInvalido(response, id)) return;
      const dados = request.body || {};
      if (!dados.nome || !String(dados.nome).trim()) {
        return response.status(400).json({ erro: "O campo nome é obrigatório." });
      }
      try {
        const statusCRUD = new StatusCRUD(db);
        const resultados = await statusCRUD.atualizaStatus(id, dados);
        if (resultados.rowsAffected[0] === 0) {
          return response.status(404).json({ erro: "Status não encontrado." });
        }
        response.json({ id: Number(id), nome: String(dados.nome).trim() });
      } catch (erro) {
        tratarErro(response, erro, "Erro ao atualizar dados do STATUS no BD!");
      }
    };
  }

  // DELETE /status/:id
  excluirStatusPorID() {
    return async function (request, response) {
      const id = request.params.id;
      if (idInvalido(response, id)) return;
      try {
        const statusCRUD = new StatusCRUD(db);
        const resultados = await statusCRUD.excluiStatusPorID(id);
        if (resultados.rowsAffected[0] === 0) {
          return response.status(404).json({ erro: "Status não encontrado." });
        }
        response.json({ mensagem: "Status excluído com sucesso." });
      } catch (erro) {
        tratarErro(response, erro, "Erro ao excluir STATUS ID = " + id);
      }
    };
  }
}  // end da class StatusController

module.exports = StatusController;