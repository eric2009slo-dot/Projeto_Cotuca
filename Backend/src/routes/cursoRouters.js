const CursoController = require("../controller/cursoController");

const obj_CursoController = new CursoController();

module.exports = (aplicacao) => {
    aplicacao.use((request, response, next) => {
        response.header("Access-Control-Allow-Origin", "*");
        next();
    });

    /******************** ROTAS = ENDPOINTS ********************/
    
    // rota GET - listagem de todos os cursos da tabela CURSO
    aplicacao.get("/Cursos",obj_CursoController.listarTodosCursos());

}; // end do module_exports
