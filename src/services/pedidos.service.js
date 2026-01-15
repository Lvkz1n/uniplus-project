const supabase = require('../config/supabase');
const uniplusService = require('./uniplus.service');

const AUDIT_TABLE = 'pedidos_log';

async function registrarAuditoria({ codigo, payload, operacao, status }) {
  // Saving raw JSON is useful for traceability and future reprocessing.
  const { error } = await supabase.from(AUDIT_TABLE).insert({
    codigo,
    payload,
    operacao,
    status,
    data_operacao: new Date().toISOString(),
  });

  if (error) {
    const err = new Error('Falha ao registrar auditoria no Supabase.');
    err.details = error.message;
    throw err;
  }
}

async function listarPedidos(options = {}) {
  return uniplusService.listarPedidos(options);
}

async function obterPedidoPorCodigo(codigo) {
  return uniplusService.obterPedidoPorCodigo(codigo);
}

async function criarPedido(dados) {
  try {
    const resposta = await uniplusService.criarPedido(dados);
    const codigo = resposta?.codigo || resposta?.id || null;

    await registrarAuditoria({
      codigo,
      payload: dados,
      operacao: 'CRIAR',
      status: 'SUCESSO',
    });

    return resposta;
  } catch (error) {
    try {
      await registrarAuditoria({
        codigo: dados?.codigo || null,
        payload: dados,
        operacao: 'CRIAR',
        status: 'FALHA',
      });
    } catch (auditError) {
      error.auditError = auditError.message;
    }
    throw error;
  }
}

async function atualizarPedido(dados) {
  try {
    const resposta = await uniplusService.atualizarPedido(dados);
    const codigo = resposta?.codigo || dados?.codigo || null;

    await registrarAuditoria({
      codigo,
      payload: dados,
      operacao: 'ATUALIZAR',
      status: 'SUCESSO',
    });

    return resposta;
  } catch (error) {
    try {
      await registrarAuditoria({
        codigo: dados?.codigo || null,
        payload: dados,
        operacao: 'ATUALIZAR',
        status: 'FALHA',
      });
    } catch (auditError) {
      error.auditError = auditError.message;
    }
    throw error;
  }
}

async function apagarPedido(codigo) {
  try {
    const resposta = await uniplusService.apagarPedido(codigo);

    await registrarAuditoria({
      codigo,
      payload: { codigo },
      operacao: 'APAGAR',
      status: 'SUCESSO',
    });

    return resposta;
  } catch (error) {
    try {
      await registrarAuditoria({
        codigo,
        payload: { codigo },
        operacao: 'APAGAR',
        status: 'FALHA',
      });
    } catch (auditError) {
      error.auditError = auditError.message;
    }
    throw error;
  }
}

module.exports = {
  listarPedidos,
  criarPedido,
  atualizarPedido,
  apagarPedido,
  obterPedidoPorCodigo,
};
