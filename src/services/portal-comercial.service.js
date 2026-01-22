const portalClient = require('../config/portal');

async function bloquearContrato(cpfCnpj) {
  const response = await portalClient.post(`/bloquear-contrato/${cpfCnpj}`);
  return response.data;
}

async function desbloquearContrato(cpfCnpj) {
  const response = await portalClient.post(`/desbloquear-contrato/${cpfCnpj}`);
  return response.data;
}

async function listarContratos() {
  const response = await portalClient.get('/contratos');
  return response.data;
}

async function listarContratosPorStatus(status) {
  const response = await portalClient.get(`/contratos/${status}`);
  return response.data;
}

async function obterContratoPorCpfCnpj(cpfCnpj) {
  const response = await portalClient.get(`/contrato/${cpfCnpj}`);
  return response.data;
}

async function obterContratoPorCpfCnpjEStatus(cpfCnpj, status) {
  const response = await portalClient.get(`/contrato/${cpfCnpj}/${status}`);
  return response.data;
}

module.exports = {
  bloquearContrato,
  desbloquearContrato,
  listarContratos,
  listarContratosPorStatus,
  obterContratoPorCpfCnpj,
  obterContratoPorCpfCnpjEStatus,
};
