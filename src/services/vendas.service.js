const uniplusService = require('./uniplus.service');

async function listarVendas(options = {}) {
  return uniplusService.listarVendas(options);
}

async function listarVendasItens(options = {}) {
  return uniplusService.listarVendasItens(options);
}

async function listarMovimentacaoEstoque(options = {}) {
  return uniplusService.listarMovimentacaoEstoque(options);
}

module.exports = {
  listarVendas,
  listarVendasItens,
  listarMovimentacaoEstoque,
};
