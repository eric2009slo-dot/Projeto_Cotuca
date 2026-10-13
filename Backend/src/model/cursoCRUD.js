class CursoCRUD {
constructor(db) {
this._db = db;
}

```
// Listar todos os cursos
geraListagemDeCursos() {
    return new Promise((resolve, reject) => {
        var sql = "SELECT * FROM NODEJS.CURSO ORDER BY ID";

        this._db.query(sql, function (erro, recordset) {
            if (erro) {
                console.log(erro);
                return reject("Listagem de todos os cursos falhou!");
            }

            resolve(recordset);
        });
    });
}

// Buscar curso por ID
geraListagemDeCursoPorID(id) {
    return new Promise((resolve, reject) => {
        var sql = "SELECT * FROM NODEJS.CURSO WHERE ID = @id";

        this._db.query(sql, { id: id }, function (erro, recordset) {
            if (erro) {
                console.log(erro);
                return reject("Consulta do curso por ID falhou!");
            }

            resolve(recordset);
        });
    });
}

// Inserir curso
insereCurso(curso) {
    return new Promise((resolve, reject) => {
        var sql = "INSERT INTO NODEJS.CURSO (nome, descricao) ";
        sql += "VALUES (@nome, @descricao)";

        var parametros = {
            nome: curso.nome,
            descricao: curso.descricao
        };

        this._db.query(sql, parametros, function (erro) {
            if (erro) {
                console.log(erro);
                return reject("Inclusão do curso falhou!");
            }

            resolve();
        });
    });
}

// Atualizar curso
atualizaCurso(id, curso) {
    return new Promise((resolve, reject) => {
        var sql = "UPDATE NODEJS.CURSO SET ";
        sql += "nome = @nome, descricao = @descricao ";
        sql += "WHERE ID = @id";

        var parametros = {
            id: id,
            nome: curso.nome,
            descricao: curso.descricao
        };

        this._db.query(sql, parametros, function (erro) {
            if (erro) {
                console.log(erro);
                return reject("Atualização do curso falhou!");
            }

            resolve();
        });
    });
}

// Excluir curso por ID
excluiCursoPorID(id) {
    return new Promise((resolve, reject) => {
        var sql = "DELETE FROM NODEJS.CURSO WHERE ID = @id";

        this._db.query(sql, { id: id }, function (erro) {
            if (erro) {
                console.log(erro);
                return reject("Exclusão do curso falhou!");
            }

            resolve();
        });
    });
}
```

}

module.exports = CursoCRUD;
