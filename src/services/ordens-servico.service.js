const uniplusService = require('./uniplus.service');

async function listarOrdensServico(options = {}) {
  return uniplusService.listarOrdensServico(options);
}

async function obterOrdemServicoPorCodigo(codigo) {
  return uniplusService.obterOrdemServicoPorCodigo(codigo);
}

module.exports = {
  listarOrdensServico,
  obterOrdemServicoPorCodigo,
};
