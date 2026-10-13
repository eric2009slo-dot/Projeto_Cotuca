// fazendo require da classe do CONTROLLER do usuário
const UsuarioController = require("../controllers/usuarioController");

// instanciando a classe UsuarioController
const obj_UsuarioController = new UsuarioController();

module.exports = (aplicacao) => {
    /******************** ROTAS = ENDPOINTS ********************/

    // rota GET - listagem de todos os usuários
    aplicacao.get("/usuarios", obj_UsuarioController.listarTodosUsuarios());

    // rota GET - dados de um usuário por ID
    aplicacao.get("/usuarios/:id", obj_UsuarioController.listarUsuarioPorID());

    // rota POST - inserir novo usuário
    aplicacao.post("/usuarios", obj_UsuarioController.inserirNovoUsuario());

    // rota PUT - atualizar os dados de um usuário
    aplicacao.put("/usuarios/:id", obj_UsuarioController.atualizarDadosUsuario());

    // rota DELETE - excluir um usuário
    aplicacao.delete("/usuarios/:id", obj_UsuarioController.excluirUsuarioPorID());

}; // end do module_exports