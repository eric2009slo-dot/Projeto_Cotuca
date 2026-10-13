// Classe com os comandos SQL da tabela STATUS
class StatusCRUD
{
  // recebe a conexão com o BD (mssql)
  constructor(db) {
    this.db = db;
  }

  // lista todos os status
  geraListagemDeStatus() {
    return new this.db.Request()
      .query("SELECT id, nome FROM STATUS ORDER BY nome");
  }

  // lista um status pelo ID
  geraListagemDeStatusPorID(id) {
    return new this.db.Request()
      .input("id", this.db.Int, Number(id))
      .query("SELECT id, nome FROM STATUS WHERE id = @id");
  }

  // insere um novo status e devolve o ID criado
  insereStatus(status) {
    return new this.db.Request()
      .input("nome", this.db.VarChar(30), String(status.nome).trim())
      .query("INSERT INTO STATUS (nome) OUTPUT INSERTED.id VALUES (@nome)");
  }

  // atualiza o nome de um status
  atualizaStatus(id, status) {
    return new this.db.Request()
      .input("id", this.db.Int, Number(id))
      .input("nome", this.db.VarChar(30), String(status.nome).trim())
      .query("UPDATE STATUS SET nome = @nome WHERE id = @id");
  }

  // exclui um status
  excluiStatusPorID(id) {
    return new this.db.Request()
      .input("id", this.db.Int, Number(id))
      .query("DELETE FROM STATUS WHERE id = @id");
  }
}  // end da class StatusCRUD

module.exports = StatusCRUD;