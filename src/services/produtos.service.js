const uniplusService = require('./uniplus.service');

async function listarProdutos(options = {}) {
  return uniplusService.listarProdutos(options);
}

async function obterProdutoPorCodigo(codigo) {
  return uniplusService.obterProdutoPorCodigo(codigo);
}

async function criarProduto(dados) {
  return uniplusService.criarProduto(dados);
}

async function atualizarProduto(dados) {
  return uniplusService.atualizarProduto(dados);
}

async function apagarProduto(codigo) {
  return uniplusService.apagarProduto(codigo);
}

module.exports = {
  listarProdutos,
  obterProdutoPorCodigo,
  criarProduto,
  atualizarProduto,
  apagarProduto,
};
