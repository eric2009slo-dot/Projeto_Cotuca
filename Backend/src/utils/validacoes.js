// Confere se o ID recebido na rota é um número inteiro maior que zero.
// Se for inválido, já responde 400 e devolve true.
function idInvalido(response, id) {
  if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
    response.status(400).json({ erro: "ID inválido." });
    return true;
  }
  return false;
}
 
// Data no formato AAAA-MM-DD e que realmente exista (2026-02-31 é inválida)
function dataValida(texto) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false;
  const data = new Date(texto + "T00:00:00Z");
  return !isNaN(data.getTime()) && data.toISOString().slice(0, 10) === texto;
}
 
// Hora no formato HH:MM (ou HH:MM:SS)
function horaValida(texto) {
  return /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(texto);
}
 
module.exports = { idInvalido, dataValida, horaValida };