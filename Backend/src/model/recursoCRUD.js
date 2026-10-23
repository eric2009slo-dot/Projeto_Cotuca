const CAMPOS = "id, codigo, nome, capacidade, localizacao, tipo, status";

// Classe com os comandos SQL da tabela RECURSO
// Laboratório e sala são recursos; o campo tipo diferencia os dois:
//   tipo = "LABORATORIO"  ou  tipo = "SALA"
// Se tipo vier null, os métodos de listagem trazem os dois tipos juntos.
class RecursoCRUD
{
  constructor(db, tipo) {
    this.db = db;
    this.tipo = tipo || null;
  }

  // lista todos os recursos do tipo
  geraListagemDeRecursos() {
    return new this.db.Request()
      .input("tipo", this.db.VarChar(12), this.tipo)
      .query(`SELECT ${CAMPOS} FROM RECURSO
              WHERE (@tipo IS NULL OR tipo = @tipo)
              ORDER BY codigo`);
  }

  // lista um recurso pelo ID
  geraListagemDeRecursoPorID(id) {
    return new this.db.Request()
      .input("id", this.db.Int, Number(id))
      .input("tipo", this.db.VarChar(12), this.tipo)
      .query(`SELECT ${CAMPOS} FROM RECURSO
              WHERE id = @id AND (@tipo IS NULL OR tipo = @tipo)`);
  }

  // insere um novo recurso e devolve o ID criado
  insereRecurso(recurso) {
    return new this.db.Request()
      .input("codigo", this.db.VarChar(20), recurso.codigo)
      .input("nome", this.db.VarChar(100), recurso.nome)
      .input("capacidade", this.db.Int, recurso.capacidade)
      .input("localizacao", this.db.VarChar(100), recurso.localizacao)
      .input("tipo", this.db.VarChar(12), this.tipo)
      .query(`INSERT INTO RECURSO (codigo, nome, capacidade, localizacao, tipo)
              OUTPUT INSERTED.id
              VALUES (@codigo, @nome, @capacidade, @localizacao, @tipo)`);
  }

  // atualiza um recurso (o tipo nunca muda)
  atualizaRecurso(id, recurso) {
    return new this.db.Request()
      .input("id", this.db.Int, Number(id))
      .input("codigo", this.db.VarChar(20), recurso.codigo)
      .input("nome", this.db.VarChar(100), recurso.nome)
      .input("capacidade", this.db.Int, recurso.capacidade)
      .input("localizacao", this.db.VarChar(100), recurso.localizacao)
      .input("tipo", this.db.VarChar(12), this.tipo)
      .query(`UPDATE RECURSO SET
                codigo = @codigo,
                nome = @nome,
                capacidade = @capacidade,
                localizacao = @localizacao
              WHERE id = @id AND tipo = @tipo`);
  }

  // exclui um recurso
  excluiRecursoPorID(id) {
    return new this.db.Request()
      .input("id", this.db.Int, Number(id))
      .input("tipo", this.db.VarChar(12), this.tipo)
      .query("DELETE FROM RECURSO WHERE id = @id AND tipo = @tipo");
  }

    // altera somente o status de um recurso
  // (tipo null = vale para laboratório e sala; recordset vazio = recurso não existe)
  atualizaStatusRecurso(id, status) {
    return new this.db.Request()
      .input("id", this.db.Int, Number(id))
      .input("status", this.db.VarChar(30), status)
      .input("tipo", this.db.VarChar(12), this.tipo)
      .query(`UPDATE RECURSO SET status = @status
              OUTPUT INSERTED.id, INSERTED.codigo, INSERTED.nome, INSERTED.tipo, INSERTED.status
              WHERE id = @id AND (@tipo IS NULL OR tipo = @tipo)`);
  }
}  // end da class RecursoCRUD


module.exports = RecursoCRUD;