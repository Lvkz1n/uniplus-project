const uniplusService = require('./uniplus.service');

async function listarEntidades(options = {}) {
  return uniplusService.listarEntidades(options);
}

async function obterEntidadePorCodigo(codigo) {
  return uniplusService.obterEntidadePorCodigo(codigo);
}

async function criarEntidade(dados) {
  return uniplusService.criarEntidade(dados);
}

async function atualizarEntidade(dados) {
  return uniplusService.atualizarEntidade(dados);
}

async function apagarEntidade(codigo) {
  return uniplusService.apagarEntidade(codigo);
}

module.exports = {
  listarEntidades,
  obterEntidadePorCodigo,
  criarEntidade,
  atualizarEntidade,
  apagarEntidade,
};
