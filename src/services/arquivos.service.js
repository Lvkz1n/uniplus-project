const uniplusService = require('./uniplus.service');

async function listarArquivos(options = {}) {
  return uniplusService.listarArquivos(options);
}

module.exports = {
  listarArquivos,
};
