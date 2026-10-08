class AlunoCRUD {
constructor(db) {
this._db = db;
}

```
// Listar todos os alunos
geraListagemDeAlunos() {
    return new Promise((resolve, reject) => {
        var sql = "SELECT * FROM NODEJS.ALUNO ORDER BY ID";

        this._db.query(sql, function (erro, recordset) {
            if (erro) {
                console.log(erro);
                return reject("Listagem de todos os alunos falhou!");
            }

            resolve(recordset);
        });
    });
}

// Buscar aluno por ID
geraListagemDeAlunoPorID(id) {
    return new Promise((resolve, reject) => {
        var sql = "SELECT * FROM NODEJS.ALUNO WHERE ID = @id";

        this._db.query(sql, { id: id }, function (erro, recordset) {
            if (erro) {
                console.log(erro);
                return reject("Consulta do aluno por ID falhou!");
            }

            resolve(recordset);
        });
    });
}

// Buscar aluno por RA
geraListagemDeAlunoPorRA(ra) {
    return new Promise((resolve, reject) => {
        var sql = "SELECT * FROM NODEJS.ALUNO WHERE RA = @ra";

        this._db.query(sql, { ra: ra }, function (erro, recordset) {
            if (erro) {
                console.log(erro);
                return reject("Consulta do aluno por RA falhou!");
            }

            resolve(recordset);
        });
    });
}

// Excluir aluno por ID
excluiAlunoPorID(id) {
    return new Promise((resolve, reject) => {
        var sql = "DELETE FROM NODEJS.ALUNO WHERE ID = @id";

        this._db.query(sql, { id: id }, function (erro) {
            if (erro) {
                console.log(erro);
                return reject("Exclusão do aluno falhou!");
            }

            resolve();
        });
    });
}

// Inserir aluno
insereAluno(aluno) {
    return new Promise((resolve, reject) => {
        var sql = "INSERT INTO NODEJS.ALUNO ";
        sql += "(RA, nome, datanascimento, email, celular, idcurso) ";
        sql += "VALUES (@ra, @nome, @datanascimento, @email, @celular, @idcurso)";

        var parametros = {
            ra: aluno.RA,
            nome: aluno.nome,
            datanascimento: aluno.datanascimento,
            email: aluno.email,
            celular: aluno.celular,
            idcurso: aluno.idcurso
        };

        this._db.query(sql, parametros, function (erro) {
            if (erro) {
                console.log(erro);
                return reject("Inclusão do aluno falhou!");
            }

            resolve();
        });
    });
}

// Atualizar aluno
atualizaAluno(id, aluno) {
    return new Promise((resolve, reject) => {
        var sql = "UPDATE NODEJS.ALUNO SET ";
        sql += "RA = @ra, ";
        sql += "nome = @nome, ";
        sql += "datanascimento = @datanascimento, ";
        sql += "email = @email, ";
        sql += "celular = @celular, ";
        sql += "idcurso = @idcurso ";
        sql += "WHERE ID = @id";

        var parametros = {
            id: id,
            ra: aluno.RA,
            nome: aluno.nome,
            datanascimento: aluno.datanascimento,
            email: aluno.email,
            celular: aluno.celular,
            idcurso: aluno.idcurso
        };

        this._db.query(sql, parametros, function (erro) {
            if (erro) {
                console.log(erro);
                return reject("Atualização do aluno falhou!");
            }

            resolve();
        });
    });
}
```

}

module.exports = AlunoCRUD;
