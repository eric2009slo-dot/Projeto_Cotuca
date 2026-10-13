const bcrypt = require("bcryptjs");
const UsuarioCRUD = require("../model/usuarioCRUD");
var db = require("../config/database");
const { tratarErro } = require("../utils/erros");
const { idInvalido, dataValida } = require("../utils/validacoes");

// Confere os dados e devolve o texto do erro (ou null se estiver tudo certo)
function validarUsuario(dados, senhaObrigatoria) {
  const campos = ["cpf", "nome_completo", "data_aniversario", "celular", "email", "login"];
  for (const campo of campos) {
    if (!dados[campo] || !String(dados[campo]).trim()) {
      return "Campos obrigatórios: cpf, nome_completo, data_aniversario, celular, email, login"
        + (senhaObrigatoria ? ", senha." : ".");
    }
  }
  if (senhaObrigatoria && !dados.senha) {
    return "O campo senha é obrigatório.";
  }
  if (dados.senha && String(dados.senha).length < 6) {
    return "A senha deve ter pelo menos 6 caracteres.";
  }
  if (String(dados.cpf).replace(/\D/g, "").length !== 11) {
    return "O CPF deve ter 11 dígitos.";
  }
  if (!dataValida(String(dados.data_aniversario))) {
    return "A data de aniversário deve estar no formato AAAA-MM-DD.";
  }
  if (!String(dados.email).includes("@")) {
    return "E-mail inválido.";
  }
  if (String(dados.celular).trim().length > 15) {
    return "O celular deve ter no máximo 15 caracteres.";
  }
  if (String(dados.nome_completo).trim().length > 150
      || String(dados.email).trim().length > 150
      || String(dados.login).trim().length > 50) {
    return "Nome e e-mail aceitam até 150 caracteres e o login até 50.";
  }
  return null;
}

// Deixa os dados limpos antes de ir para o BD
function limparUsuario(dados) {
  return {
    cpf: String(dados.cpf).replace(/\D/g, ""),
    nome_completo: String(dados.nome_completo).trim(),
    data_aniversario: String(dados.data_aniversario),
    celular: String(dados.celular).trim(),
    email: String(dados.email).trim(),
    login: String(dados.login).trim()
  };
}

// ATENÇÃO: nunca usar console.log(request.body) aqui, porque tem a senha

class UsuarioController
{
  // GET /usuarios
  listarTodosUsuarios() {
    return async function (request, response) {
      try {
        const usuarioCRUD = new UsuarioCRUD(db);
        const resultados = await usuarioCRUD.geraListagemDeUsuarios();
        response.json(resultados.recordset);
      } catch (erro) {
        tratarErro(response, erro, "Erro ao listar TODOS os USUÁRIOS!");
      }
    };
  }

  // GET /usuarios/:id
  listarUsuarioPorID() {
    return async function (request, response) {
      const id = request.params.id;
      if (idInvalido(response, id)) return;
      try {
        const usuarioCRUD = new UsuarioCRUD(db);
        const resultados = await usuarioCRUD.geraListagemDeUsuarioPorID(id);
        if (resultados.recordset.length === 0) {
          return response.status(404).json({ erro: "Usuário não encontrado." });
        }
        response.json(resultados.recordset[0]);
      } catch (erro) {
        tratarErro(response, erro, "Erro ao listar dados do USUÁRIO ID = " + id);
      }
    };
  }

  // POST /usuarios
  inserirNovoUsuario() {
    return async function (request, response) {
      const dados = request.body || {};
      const erroValidacao = validarUsuario(dados, true);
      if (erroValidacao) {
        return response.status(400).json({ erro: erroValidacao });
      }
      try {
        const usuario = limparUsuario(dados);
        // criptografando a senha antes de gravar no BD
        const senhaHash = await bcrypt.hash(String(dados.senha), 10);
        const usuarioCRUD = new UsuarioCRUD(db);
        const resultados = await usuarioCRUD.insereUsuario(usuario, senhaHash);
        response.status(201).json({
          id: resultados.recordset[0].id,
          login: usuario.login
        });
      } catch (erro) {
        tratarErro(response, erro, "Erro ao inserir novo USUÁRIO no BD!");
      }
    };
  }

  // PUT /usuarios/:id  (a senha é opcional: se não vier, mantém a atual)
  atualizarDadosUsuario() {
    return async function (request, response) {
      const id = request.params.id;
      if (idInvalido(response, id)) return;
      const dados = request.body || {};
      const erroValidacao = validarUsuario(dados, false);
      if (erroValidacao) {
        return response.status(400).json({ erro: erroValidacao });
      }
      try {
        const usuario = limparUsuario(dados);
        const senhaHash = dados.senha ? await bcrypt.hash(String(dados.senha), 10) : null;
        const usuarioCRUD = new UsuarioCRUD(db);
        const resultados = await usuarioCRUD.atualizaUsuario(id, usuario, senhaHash);
        if (resultados.rowsAffected[0] === 0) {
          return response.status(404).json({ erro: "Usuário não encontrado." });
        }
        response.json({ id: Number(id), login: usuario.login });
      } catch (erro) {
        tratarErro(response, erro, "Erro ao atualizar dados do USUÁRIO no BD!");
      }
    };
  }

  // DELETE /usuarios/:id
  excluirUsuarioPorID() {
    return async function (request, response) {
      const id = request.params.id;
      if (idInvalido(response, id)) return;
      try {
        const usuarioCRUD = new UsuarioCRUD(db);
        const resultados = await usuarioCRUD.excluiUsuarioPorID(id);
        if (resultados.rowsAffected[0] === 0) {
          return response.status(404).json({ erro: "Usuário não encontrado." });
        }
        response.json({ mensagem: "Usuário excluído com sucesso." });
      } catch (erro) {
        tratarErro(response, erro, "Erro ao excluir USUÁRIO ID = " + id);
      }
    };
  }
}  // end da class UsuarioController

module.exports = UsuarioController;