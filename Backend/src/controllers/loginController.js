const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const LoginCRUD = require("../model/loginCRUD");
var db = require("../config/database");
const { tratarErro } = require("../utils/erros");

class LoginController
{
  // POST /login   body: { "email": "maria@email.com", "senha": "123456" }
  // Resposta: { "token": "...", "usuario": { id, nome_completo, email, login } }
  efetuarLogin() {
    return async function (request, response) {
      const dados = request.body || {};
      if (!dados.email || !dados.senha) {
        return response.status(400).json({ erro: "Informe o email e a senha." });
      }
      try {
        const loginCRUD = new LoginCRUD(db);
        const resultados = await loginCRUD.buscaUsuarioPorLogin(String(dados.email).trim());
        const usuario = resultados.recordset[0];

        // mesma mensagem para login e senha errados (não revela qual está errado)
        const senhaConfere = usuario
          && await bcrypt.compare(String(dados.senha), usuario.senha_hash);
        if (!senhaConfere) {
          return response.status(401).json({ erro: "Login ou senha inválidos." });
        }

        // todo acesso fica registrado no BD
        await loginCRUD.registraAcesso(usuario.id);

        // token que o front vai guardar para usar nas próximas telas
        const token = jwt.sign(
          { id: usuario.id, login: usuario.login },
          process.env.JWT_SECRET,
          { expiresIn: "8h" }
        );

        response.json({
          token: token,
          usuario: {
            id: usuario.id,
            nome_completo: usuario.nome_completo,
            email: usuario.email,
            login: usuario.login
          }
        });
      } catch (erro) {
        tratarErro(response, erro, "Erro ao efetuar o LOGIN!");
      }
    };
  }
}  // end da class LoginController

module.exports = LoginController;