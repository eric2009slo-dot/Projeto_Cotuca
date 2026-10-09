// Trata os erros do SQL Server e devolve uma resposta em JSON
// Formato de erro usado em toda a API: { "erro": "mensagem" }
function tratarErro(response, erro, mensagemPadrao) {
  console.log(erro);

  // 2627 e 2601 = valor repetido em coluna UNIQUE (CPF, e-mail, login, código, nome)
  if (erro.number === 2627 || erro.number === 2601) {
    return response.status(409).json({
      erro: "Já existe um registro com esses dados (valor repetido)."
    });
  }

  // 547 = chave estrangeira (o registro está ligado a outros dados)
  if (erro.number === 547) {
    return response.status(409).json({
      erro: "Operação não permitida: o registro está ligado a outros dados."
    });
  }

  return response.status(500).json({ erro: mensagemPadrao });
}

module.exports = { tratarErro };