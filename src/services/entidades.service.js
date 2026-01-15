const auditService = require('./audit.service');
const uniplusService = require('./uniplus.service');

const AUDIT_TABLE = 'entidades_log';
const RESOURCE = 'entidades';

async function registrarAuditoria({ codigo, payload, operacao, status, rota, metodo }) {
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

async function listarEntidades(options = {}, context = {}) {
  try {
    const data = await uniplusService.listarEntidades(options);
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

async function obterEntidadePorCodigo(codigo, context = {}) {
  try {
    const data = await uniplusService.obterEntidadePorCodigo(codigo);
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

async function criarEntidade(dados, context = {}) {
  try {
    const resposta = await uniplusService.criarEntidade(dados);
    const codigo = resposta?.codigo || dados?.codigo || null;

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

async function atualizarEntidade(dados, context = {}) {
  try {
    const resposta = await uniplusService.atualizarEntidade(dados);
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

async function apagarEntidade(codigo, context = {}) {
  try {
    const resposta = await uniplusService.apagarEntidade(codigo);

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
  listarEntidades,
  obterEntidadePorCodigo,
  criarEntidade,
  atualizarEntidade,
  apagarEntidade,
};
