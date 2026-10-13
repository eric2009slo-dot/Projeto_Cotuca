// Campos devolvidos para o front (NUNCA devolver senha_hash)
// A data de aniversário sai como texto AAAA-MM-DD
const CAMPOS = `id, cpf, nome_completo,
  CONVERT(VARCHAR(10), data_aniversario, 23) AS data_aniversario,
  celular, email, login, data_cadastro, data_ultimo_acesso`;

// Classe com os comandos SQL da tabela USUARIO
class UsuarioCRUD
{
  constructor(db) {
    this.db = db;
  }

  // lista todos os usuários
  geraListagemDeUsuarios() {
    return new this.db.Request()
      .query("SELECT " + CAMPOS + " FROM USUARIO ORDER BY nome_completo");
  }

  // lista um usuário pelo ID
  geraListagemDeUsuarioPorID(id) {
    return new this.db.Request()
      .input("id", this.db.Int, Number(id))
      .query("SELECT " + CAMPOS + " FROM USUARIO WHERE id = @id");
  }

  // insere um novo usuário (a senha já chega criptografada)
  insereUsuario(usuario, senhaHash) {
    return new this.db.Request()
      .input("cpf", this.db.Char(11), usuario.cpf)
      .input("nome_completo", this.db.VarChar(150), usuario.nome_completo)
      .input("data_aniversario", this.db.VarChar(10), usuario.data_aniversario)
      .input("celular", this.db.VarChar(15), usuario.celular)
      .input("email", this.db.VarChar(150), usuario.email)
      .input("login", this.db.VarChar(50), usuario.login)
      .input("senha_hash", this.db.VarChar(255), senhaHash)
      .query(`
        INSERT INTO USUARIO
          (cpf, nome_completo, data_aniversario, celular, email, login, senha_hash)
        OUTPUT INSERTED.id
        VALUES
          (@cpf, @nome_completo, @data_aniversario, @celular, @email, @login, @senha_hash)
      `);
  }

  // atualiza um usuário; se senhaHash for null, mantém a senha atual
  atualizaUsuario(id, usuario, senhaHash) {
    return new this.db.Request()
      .input("id", this.db.Int, Number(id))
      .input("cpf", this.db.Char(11), usuario.cpf)
      .input("nome_completo", this.db.VarChar(150), usuario.nome_completo)
      .input("data_aniversario", this.db.VarChar(10), usuario.data_aniversario)
      .input("celular", this.db.VarChar(15), usuario.celular)
      .input("email", this.db.VarChar(150), usuario.email)
      .input("login", this.db.VarChar(50), usuario.login)
      .input("senha_hash", this.db.VarChar(255), senhaHash)
      .query(`
        UPDATE USUARIO SET
          cpf = @cpf,
          nome_completo = @nome_completo,
          data_aniversario = @data_aniversario,
          celular = @celular,
          email = @email,
          login = @login,
          senha_hash = COALESCE(@senha_hash, senha_hash)
        WHERE id = @id
      `);
  }

  // exclui um usuário
  excluiUsuarioPorID(id) {
    return new this.db.Request()
      .input("id", this.db.Int, Number(id))
      .query("DELETE FROM USUARIO WHERE id = @id");
  }
}  // end da class UsuarioCRUD

module.exports = UsuarioCRUD;