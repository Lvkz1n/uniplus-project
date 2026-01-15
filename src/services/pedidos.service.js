const auditService = require('./audit.service');
const uniplusService = require('./uniplus.service');

const AUDIT_TABLE = 'pedidos_log';
const RESOURCE = 'pedidos';

async function registrarAuditoria({ codigo, payload, operacao, status, rota, metodo }) {
  // Saving raw JSON is useful for traceability and future reprocessing.
  await auditService.registrarAuditoria({
    table: AUDIT_TABLE,
    recurso: RESOURCE,
    rota,
    metodo,
    codigo,
    payload,
    operacao,
    status,
  });
}

async function listarPedidos(options = {}, context = {}) {
  try {
    const data = await uniplusService.listarPedidos(options);
    await registrarAuditoria({
      codigo: null,
      payload: options?.params || options,
      operacao: 'LISTAR',
      status: 'SUCESSO',
      ...context,
    });
    return data;
  } catch (error) {
    try {
      await registrarAuditoria({
        codigo: null,
        payload: options?.params || options,
        operacao: 'LISTAR',
        status: 'FALHA',
        ...context,
      });
    } catch (auditError) {
      error.auditError = auditError.message;
    }
    throw error;
  }
}

async function obterPedidoPorCodigo(codigo, context = {}) {
  try {
    const data = await uniplusService.obterPedidoPorCodigo(codigo);
    await registrarAuditoria({
      codigo,
      payload: { codigo },
      operacao: 'CONSULTAR',
      status: 'SUCESSO',
      ...context,
    });
    return data;
  } catch (error) {
    try {
      await registrarAuditoria({
        codigo,
        payload: { codigo },
        operacao: 'CONSULTAR',
        status: 'FALHA',
        ...context,
      });
    } catch (auditError) {
      error.auditError = auditError.message;
    }
    throw error;
  }
}

async function criarPedido(dados, context = {}) {
  try {
    const resposta = await uniplusService.criarPedido(dados);
    const codigo = resposta?.codigo || resposta?.id || null;

    await registrarAuditoria({
      codigo,
      payload: dados,
      operacao: 'CRIAR',
      status: 'SUCESSO',
      ...context,
    });

    return resposta;
  } catch (error) {
    try {
      await registrarAuditoria({
        codigo: dados?.codigo || null,
        payload: dados,
        operacao: 'CRIAR',
        status: 'FALHA',
        ...context,
      });
    } catch (auditError) {
      error.auditError = auditError.message;
    }
    throw error;
  }
}

async function atualizarPedido(dados, context = {}) {
  try {
    const resposta = await uniplusService.atualizarPedido(dados);
    const codigo = resposta?.codigo || dados?.codigo || null;

    await registrarAuditoria({
      codigo,
      payload: dados,
      operacao: 'ATUALIZAR',
      status: 'SUCESSO',
      ...context,
    });

    return resposta;
  } catch (error) {
    try {
      await registrarAuditoria({
        codigo: dados?.codigo || null,
        payload: dados,
        operacao: 'ATUALIZAR',
        status: 'FALHA',
        ...context,
      });
    } catch (auditError) {
      error.auditError = auditError.message;
    }
    throw error;
  }
}

async function apagarPedido(codigo, context = {}) {
  try {
    const resposta = await uniplusService.apagarPedido(codigo);

    await registrarAuditoria({
      codigo,
      payload: { codigo },
      operacao: 'APAGAR',
      status: 'SUCESSO',
      ...context,
    });

    return resposta;
  } catch (error) {
    try {
      await registrarAuditoria({
        codigo,
        payload: { codigo },
        operacao: 'APAGAR',
        status: 'FALHA',
        ...context,
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
