const axios = require('axios');

const baseURL = process.env.PORTAL_BASE_URL || 'https://canal.intelidata.inf.br/public-api';

if (!baseURL) {
  throw new Error('PORTAL_BASE_URL e obrigatorio.');
}

const portalClient = axios.create({
  baseURL,
  timeout: 15000,
});

portalClient.interceptors.request.use((config) => {
  const token = process.env.PORTAL_API_TOKEN;
  if (!token) {
    throw new Error('PORTAL_API_TOKEN e obrigatorio para a API do Portal Comercial.');
  }

  config.headers.token = token;
  return config;
});

portalClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    let message = 'Erro ao comunicar com a API do Portal Comercial.';

    if (status === 401 || status === 403) {
      message = 'Nao autorizado na API do Portal Comercial.';
    } else if (status >= 500) {
      message = 'Erro interno no servidor do Portal Comercial.';
    }

    const details = error.response?.data || error.message;
    const normalized = new Error(message);
    normalized.status = status || 500;
    normalized.details = details;
    throw normalized;
  }
);

module.exports = portalClient;
