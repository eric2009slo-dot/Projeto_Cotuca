// SELECT padrão das reservas, já juntando usuário, recurso e status.
// Datas saem como texto AAAA-MM-DD e horas como HH:MM (fácil para o React usar).
const SELECT_RESERVA = `
  SELECT r.id,
         r.id_usuario,  u.nome_completo AS nome_usuario,
         r.id_recurso,  rc.codigo AS codigo_recurso, rc.nome AS nome_recurso, rc.tipo AS tipo_recurso,
         r.id_status,   s.nome AS nome_status,
         CONVERT(VARCHAR(10), r.data_inicial, 23) AS data_inicial,
         CONVERT(VARCHAR(10), r.data_final, 23)   AS data_final,
         CONVERT(VARCHAR(5),  r.hora_inicial, 108) AS hora_inicial,
         CONVERT(VARCHAR(5),  r.hora_final, 108)   AS hora_final
  FROM RESERVA r
  INNER JOIN USUARIO u  ON u.id  = r.id_usuario
  INNER JOIN RECURSO rc ON rc.id = r.id_recurso
  INNER JOIN STATUS s   ON s.id  = r.id_status`;

// Classe com os comandos SQL da tabela RESERVA
class ReservaCRUD
{
  constructor(db) {
    this.db = db;
  }

  // Lista as reservas com filtros opcionais (todos podem ser combinados):
  //   codigo_recurso, nome_recurso, id_recurso, id_usuario, nome_usuario,
  //   id_status, data_inicial, data_final (período), hora
  geraListagemDeReservas(filtros) {
    const request = new this.db.Request();
    const condicoes = [];

    if (filtros.codigo_recurso) {
      request.input("codigo_recurso", this.db.VarChar(40), "%" + filtros.codigo_recurso + "%");
      condicoes.push("rc.codigo LIKE @codigo_recurso");
    }
    if (filtros.nome_recurso) {
      request.input("nome_recurso", this.db.VarChar(120), "%" + filtros.nome_recurso + "%");
      condicoes.push("rc.nome LIKE @nome_recurso");
    }
    if (filtros.id_recurso) {
      request.input("id_recurso", this.db.Int, Number(filtros.id_recurso));
      condicoes.push("r.id_recurso = @id_recurso");
    }
    if (filtros.id_usuario) {
      request.input("id_usuario", this.db.Int, Number(filtros.id_usuario));
      condicoes.push("r.id_usuario = @id_usuario");
    }
    if (filtros.nome_usuario) {
      request.input("nome_usuario", this.db.VarChar(160), "%" + filtros.nome_usuario + "%");
      condicoes.push("u.nome_completo LIKE @nome_usuario");
    }
    if (filtros.id_status) {
      request.input("id_status", this.db.Int, Number(filtros.id_status));
      condicoes.push("r.id_status = @id_status");
    }
    // data ou período: traz as reservas que têm algum dia dentro do período
    // (se vier só data_inicial, procura reservas que cobrem esse dia)
    if (filtros.data_inicial || filtros.data_final) {
      const dataIni = filtros.data_inicial || filtros.data_final;
      const dataFim = filtros.data_final || filtros.data_inicial;
      request.input("data_ini", this.db.VarChar(10), dataIni);
      request.input("data_fim", this.db.VarChar(10), dataFim);
      condicoes.push("r.data_inicial <= CAST(@data_fim AS DATE) AND r.data_final >= CAST(@data_ini AS DATE)");
    }
    // hora: traz as reservas que estão acontecendo naquele horário
    if (filtros.hora) {
      request.input("hora", this.db.VarChar(8), filtros.hora);
      condicoes.push("r.hora_inicial <= CAST(@hora AS TIME) AND r.hora_final > CAST(@hora AS TIME)");
    }

    const where = condicoes.length > 0 ? " WHERE " + condicoes.join(" AND ") : "";
    return request.query(SELECT_RESERVA + where + " ORDER BY r.data_inicial, r.hora_inicial");
  }

  // lista uma reserva pelo ID
  geraListagemDeReservaPorID(id) {
    return new this.db.Request()
      .input("id", this.db.Int, Number(id))
      .query(SELECT_RESERVA + " WHERE r.id = @id");
  }

  // Confere se o recurso já está tomado no período da reserva.
  // Conta as reservas do mesmo recurso, com status diferente de "Livre",
  // que se sobrepõem ao período novo. idIgnorar = reserva que está sendo
  // editada (0 quando for uma reserva nova).
  // Se a reserva nova tiver status "Livre", não há conflito.
  // O parâmetro "transacao" é opcional: quando vem preenchido, a consulta
  // roda dentro dessa transação (sem ele, funciona como antes).
  existeConflito(reserva, idIgnorar, transacao) {
    const request = transacao ? new this.db.Request(transacao) : new this.db.Request();
    return request
      .input("id_recurso", this.db.Int, Number(reserva.id_recurso))
      .input("id_status", this.db.Int, Number(reserva.id_status))
      .input("id_ignorar", this.db.Int, Number(idIgnorar) || 0)
      .input("data_inicial", this.db.VarChar(10), reserva.data_inicial)
      .input("data_final", this.db.VarChar(10), reserva.data_final)
      .input("hora_inicial", this.db.VarChar(8), reserva.hora_inicial)
      .input("hora_final", this.db.VarChar(8), reserva.hora_final)
      .query(`
        DECLARE @inicio DATETIME =
          CAST(CAST(@data_inicial AS DATE) AS DATETIME) + CAST(CAST(@hora_inicial AS TIME) AS DATETIME);
        DECLARE @fim DATETIME =
          CAST(CAST(@data_final AS DATE) AS DATETIME) + CAST(CAST(@hora_final AS TIME) AS DATETIME);

        SELECT COUNT(*) AS total
        FROM RESERVA r
        INNER JOIN STATUS s ON s.id = r.id_status
        WHERE r.id_recurso = @id_recurso
          AND r.id <> @id_ignorar
          AND s.nome <> 'Livre'
          AND (SELECT nome FROM STATUS WHERE id = @id_status) <> 'Livre'
          AND CAST(r.data_inicial AS DATETIME) + CAST(r.hora_inicial AS DATETIME) < @fim
          AND CAST(r.data_final AS DATETIME)   + CAST(r.hora_final AS DATETIME)   > @inicio
      `);
  }

  // insere uma nova reserva e devolve o ID criado
  // (o parâmetro "transacao" é opcional, como no existeConflito)
  insereReserva(reserva, transacao) {
    const request = transacao ? new this.db.Request(transacao) : new this.db.Request();
    return request
      .input("id_usuario", this.db.Int, Number(reserva.id_usuario))
      .input("id_recurso", this.db.Int, Number(reserva.id_recurso))
      .input("id_status", this.db.Int, Number(reserva.id_status))
      .input("data_inicial", this.db.VarChar(10), reserva.data_inicial)
      .input("data_final", this.db.VarChar(10), reserva.data_final)
      .input("hora_inicial", this.db.VarChar(8), reserva.hora_inicial)
      .input("hora_final", this.db.VarChar(8), reserva.hora_final)
      .query(`
        INSERT INTO RESERVA
          (id_usuario, id_recurso, id_status, data_inicial, data_final, hora_inicial, hora_final)
        OUTPUT INSERTED.id
        VALUES
          (@id_usuario, @id_recurso, @id_status, @data_inicial, @data_final, @hora_inicial, @hora_final)
      `);
  }

  // atualiza uma reserva
  // (o parâmetro "transacao" é opcional, como no existeConflito)
  atualizaReserva(id, reserva, transacao) {
    const request = transacao ? new this.db.Request(transacao) : new this.db.Request();
    return request
      .input("id", this.db.Int, Number(id))
      .input("id_usuario", this.db.Int, Number(reserva.id_usuario))
      .input("id_recurso", this.db.Int, Number(reserva.id_recurso))
      .input("id_status", this.db.Int, Number(reserva.id_status))
      .input("data_inicial", this.db.VarChar(10), reserva.data_inicial)
      .input("data_final", this.db.VarChar(10), reserva.data_final)
      .input("hora_inicial", this.db.VarChar(8), reserva.hora_inicial)
      .input("hora_final", this.db.VarChar(8), reserva.hora_final)
      .query(`
        UPDATE RESERVA SET
          id_usuario = @id_usuario,
          id_recurso = @id_recurso,
          id_status = @id_status,
          data_inicial = @data_inicial,
          data_final = @data_final,
          hora_inicial = @hora_inicial,
          hora_final = @hora_final
        WHERE id = @id
      `);
  }

  // exclui uma reserva
  excluiReservaPorID(id) {
    return new this.db.Request()
      .input("id", this.db.Int, Number(id))
      .query("DELETE FROM RESERVA WHERE id = @id");
  }

  // ---------------------------------------------------------------------
  // Validação + gravação em uma única transação
  // ---------------------------------------------------------------------

  // Roda dentro de uma transação já aberta. Trava a linha do recurso
  // (UPDLOCK + HOLDLOCK), então dois pedidos para o mesmo recurso (ou uma
  // troca de status do recurso) esperam um ao outro até o COMMIT/ROLLBACK.
  // Devolve o motivo da recusa ou null se tudo estiver certo:
  //   "recurso_inexistente" | "recurso_bloqueado" | "conflito"
  async validaReserva(reserva, idIgnorar, transacao) {
    const recurso = await new this.db.Request(transacao)
      .input("id_recurso", this.db.Int, Number(reserva.id_recurso))
      .query("SELECT id, status FROM RECURSO WITH (UPDLOCK, HOLDLOCK) WHERE id = @id_recurso");

    if (recurso.recordset.length === 0) {
      return "recurso_inexistente";
    }

    const statusRecurso = String(recurso.recordset[0].status || "").trim().toLowerCase();
    if (statusRecurso === "bloqueado") {
      return "recurso_bloqueado";
    }

    const conflito = await this.existeConflito(reserva, idIgnorar, transacao);
    if (conflito.recordset[0].total > 0) {
      return "conflito";
    }

    return null;
  }

  // Cadastra uma reserva já validando recurso (existe? bloqueado?) e conflito
  // de horário, tudo na mesma transação.
  // Retorna { resultado: "ok", id } ou { resultado: <motivo da recusa> }.
  async insereReservaValidada(reserva) {
    const transacao = new this.db.Transaction();
    await transacao.begin();
    try {
      const problema = await this.validaReserva(reserva, 0, transacao);
      if (problema) {
        await transacao.rollback();
        return { resultado: problema };
      }

      const inserida = await this.insereReserva(reserva, transacao);
      await transacao.commit();
      return { resultado: "ok", id: inserida.recordset[0].id };
    } catch (erro) {
      try { await transacao.rollback(); } catch (e) { /* transação já encerrada */ }
      throw erro;
    }
  }

  // Atualiza uma reserva já validando recurso (existe? bloqueado?) e conflito
  // de horário, tudo na mesma transação.
  // Retorna { resultado: "ok" } ou { resultado: <motivo da recusa> }
  // (além dos motivos do cadastro, pode vir "reserva_inexistente").
  async atualizaReservaValidada(id, reserva) {
    const transacao = new this.db.Transaction();
    await transacao.begin();
    try {
      const existente = await new this.db.Request(transacao)
        .input("id", this.db.Int, Number(id))
        .query("SELECT id FROM RESERVA WHERE id = @id");
      if (existente.recordset.length === 0) {
        await transacao.rollback();
        return { resultado: "reserva_inexistente" };
      }

      const problema = await this.validaReserva(reserva, id, transacao);
      if (problema) {
        await transacao.rollback();
        return { resultado: problema };
      }

      const atualizada = await this.atualizaReserva(id, reserva, transacao);
      if (atualizada.rowsAffected[0] === 0) {
        await transacao.rollback();
        return { resultado: "reserva_inexistente" };
      }

      await transacao.commit();
      return { resultado: "ok" };
    } catch (erro) {
      try { await transacao.rollback(); } catch (e) { /* transação já encerrada */ }
      throw erro;
    }
  }
}  // end da class ReservaCRUD

module.exports = ReservaCRUD;