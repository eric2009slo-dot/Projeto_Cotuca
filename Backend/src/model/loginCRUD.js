// Classe com os comandos SQL do login (tabelas USUARIO e ACESSO)
class LoginCRUD
{
  constructor(db) {
    this.db = db;
  }

  // busca o usuário pelo email (traz o senha_hash para conferir a senha)
  buscaUsuarioPorLogin(email) {
    return new this.db.Request()
      .input("email", this.db.VarChar(255), email)
      .query(`SELECT id, nome_completo, email, login, senha_hash
              FROM USUARIO WHERE email = @email`);
  }

  // registra o acesso na tabela ACESSO e atualiza o último acesso do usuário
  registraAcesso(idUsuario) {
    return new this.db.Request()
      .input("id_usuario", this.db.Int, Number(idUsuario))
      .query(`
        INSERT INTO ACESSO (id_usuario) VALUES (@id_usuario);
        UPDATE USUARIO SET data_ultimo_acesso = SYSDATETIME() WHERE id = @id_usuario;
      `);
  }
}  // end da class LoginCRUD

module.exports = LoginCRUD;