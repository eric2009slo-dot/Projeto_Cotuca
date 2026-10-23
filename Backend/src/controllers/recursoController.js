const RecursoCRUD = require("../model/recursoCRUD");
var db = require("../config/database");
const { tratarErro } = require("../utils/erros");
const { idInvalido } = require("../utils/validacoes");

// Confere os dados e devolve o texto do erro (ou null se estiver tudo certo)
function validarRecurso(dados) {
  const campos = ["codigo", "nome", "capacidade", "localizacao"];
  for (const campo of campos) {
    if (dados[campo] === undefined || dados[campo] === null || String(dados[campo]).trim() === "") {
      return "Campos obrigatórios: codigo, nome, capacidade, localizacao.";
    }
  }
  if (!Number.isInteger(Number(dados.capacidade)) || Number(dados.capacidade) <= 0) {
    return "A capacidade deve ser um número inteiro maior que zero.";
  }
  if (String(dados.codigo).trim().length > 20
      || String(dados.nome).trim().length > 100
      || String(dados.localizacao).trim().length > 100) {
    return "Código aceita até 20 caracteres; nome e localização, até 100.";
  }
  return null;
}

function limparRecurso(dados) {
  return {
    codigo: String(dados.codigo).trim(),
    nome: String(dados.nome).trim(),
    capacidade: Number(dados.capacidade),
    localizacao: String(dados.localizacao).trim()
  };
}

// Um mesmo controller serve para laboratório e sala.
// O tipo é informado na criação:
//   new RecursoController("LABORATORIO")
//   new RecursoController("SALA")
//   new RecursoController(null)  -> só para listar os dois tipos juntos
class RecursoController
{
  constructor(tipo) {
    this.tipo = tipo || null;
    this.nomeTipo = tipo === "LABORATORIO" ? "Laboratório"
                  : tipo === "SALA" ? "Sala" : "Recurso";
  }

  // GET /laboratorios  |  GET /salas  |  GET /recursos
  listarTodosRecursos() {
    const tipo = this.tipo;
    const nomeTipo = this.nomeTipo;
    return async function (request, response) {
      try {
        const recursoCRUD = new RecursoCRUD(db, tipo);
        const resultados = await recursoCRUD.geraListagemDeRecursos();
        response.json(resultados.recordset);
      } catch (erro) {
        tratarErro(response, erro, "Erro ao listar: " + nomeTipo);
      }
    };
  }

  // GET /laboratorios/:id  |  GET /salas/:id  |  GET /recursos/:id
  listarRecursoPorID() {
    const tipo = this.tipo;
    const nomeTipo = this.nomeTipo;
    return async function (request, response) {
      const id = request.params.id;
      if (idInvalido(response, id)) return;
      try {
        const recursoCRUD = new RecursoCRUD(db, tipo);
        const resultados = await recursoCRUD.geraListagemDeRecursoPorID(id);
        if (resultados.recordset.length === 0) {
          return response.status(404).json({ erro: nomeTipo + " não encontrado(a)." });
        }
        response.json(resultados.recordset[0]);
      } catch (erro) {
        tratarErro(response, erro, "Erro ao listar dados: " + nomeTipo + " ID = " + id);
      }
    };
  }

  // POST /laboratorios  |  POST /salas
  inserirNovoRecurso() {
    const tipo = this.tipo;
    const nomeTipo = this.nomeTipo;
    return async function (request, response) {
      const dados = request.body || {};
      const erroValidacao = validarRecurso(dados);
      if (erroValidacao) {
        return response.status(400).json({ erro: erroValidacao });
      }
      try {
        const recurso = limparRecurso(dados);
        const recursoCRUD = new RecursoCRUD(db, tipo);
        const resultados = await recursoCRUD.insereRecurso(recurso);
        response.status(201).json({
          id: resultados.recordset[0].id,
          codigo: recurso.codigo
        });
      } catch (erro) {
        tratarErro(response, erro, "Erro ao inserir no BD: " + nomeTipo);
      }
    };
  }

  // PUT /laboratorios/:id  |  PUT /salas/:id
  atualizarDadosRecurso() {
    const tipo = this.tipo;
    const nomeTipo = this.nomeTipo;
    return async function (request, response) {
      const id = request.params.id;
      if (idInvalido(response, id)) return;
      const dados = request.body || {};
      const erroValidacao = validarRecurso(dados);
      if (erroValidacao) {
        return response.status(400).json({ erro: erroValidacao });
      }
      try {
        const recurso = limparRecurso(dados);
        const recursoCRUD = new RecursoCRUD(db, tipo);
        const resultados = await recursoCRUD.atualizaRecurso(id, recurso);
        if (resultados.rowsAffected[0] === 0) {
          return response.status(404).json({ erro: nomeTipo + " não encontrado(a)." });
        }
        response.json({ id: Number(id), codigo: recurso.codigo });
      } catch (erro) {
        tratarErro(response, erro, "Erro ao atualizar no BD: " + nomeTipo);
      }
    };
  }

  // DELETE /laboratorios/:id  |  DELETE /salas/:id
  excluirRecursoPorID() {
    const tipo = this.tipo;
    const nomeTipo = this.nomeTipo;
    return async function (request, response) {
      const id = request.params.id;
      if (idInvalido(response, id)) return;
      try {
        const recursoCRUD = new RecursoCRUD(db, tipo);
        const resultados = await recursoCRUD.excluiRecursoPorID(id);
        if (resultados.rowsAffected[0] === 0) {
          return response.status(404).json({ erro: nomeTipo + " não encontrado(a)." });
        }
        response.json({ mensagem: nomeTipo + " excluído(a) com sucesso." });
      } catch (erro) {
        tratarErro(response, erro, "Erro ao excluir: " + nomeTipo + " ID = " + id);
      }
    };
  }

  // PUT /recursos/:id/status
  atualizarStatusRecurso() {
    const tipo = this.tipo;

    return async function (request, response) {
      const STATUS_VALIDOS = [
        "Livre",
        "Ocupado",
        "Reservado",
        "Bloqueado"
      ];

      const id = request.params.id;
      const { status } = request.body || {};

      if (idInvalido(response, id)) return;

      if (
        typeof status !== "string" ||
        !STATUS_VALIDOS.includes(status.trim())
      ) {
        return response.status(400).json({
          erro: "Status inválido."
        });
      }

      try {
        const recursoCRUD = new RecursoCRUD(db, tipo);

        const resultados = await recursoCRUD.atualizaStatusRecurso(
          id,
          status.trim()
        );

        if (resultados.recordset.length === 0) {
          return response.status(404).json({
            erro: "Recurso não encontrado."
          });
        }

        return response.status(200).json({
          mensagem: "Status atualizado com sucesso.",
          recurso: resultados.recordset[0]
        });

      } catch (erro) {
        tratarErro(response, erro, "Erro ao atualizar status do recurso");
      }
    };
  }
}  // end da class RecursoController

module.exports = RecursoController;