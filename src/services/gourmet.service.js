const uniplusService = require('./uniplus.service');

async function listarContas(options = {}) {
  return uniplusService.listarContasGourmet(options);
}

async function criarConta(dados) {
  return uniplusService.criarContaGourmet(dados);
}

module.exports = {
  listarContas,
  criarConta,
};
