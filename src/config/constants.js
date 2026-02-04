// Constantes centralizadas da aplicação.

// Paginação padrão para listagens.
const DEFAULT_LIMIT = 25;

// Tamanho máximo de página permitido.
const MAX_PAGE_SIZE = 100;

// Número máximo de páginas para evitar loops infinitos.
const MAX_PAGES = 1000;

// Limite padrão para buscar todos os registros.
const ALL_LIMIT = Number(process.env.UNIPLUS_ALL_LIMIT) || 1000;

// Chaves possíveis para extrair listas de respostas da API.
const LIST_KEYS = [
  "data",
  "items",
  "registros",
  "records",
  "content",
  "conteudo",
];

module.exports = {
  DEFAULT_LIMIT,
  MAX_PAGE_SIZE,
  MAX_PAGES,
  ALL_LIMIT,
  LIST_KEYS,
};
