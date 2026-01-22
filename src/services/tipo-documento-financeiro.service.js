const uniplusService = require('./uniplus.service');

async function listarTiposDocumentoFinanceiro(options = {}) {
  return uniplusService.listarTiposDocumentoFinanceiro(options);
}

async function obterTipoDocumentoFinanceiroPorCodigo(codigo) {
  return uniplusService.obterTipoDocumentoFinanceiroPorCodigo(codigo);
}

module.exports = {
  listarTiposDocumentoFinanceiro,
  obterTipoDocumentoFinanceiroPorCodigo,
};
