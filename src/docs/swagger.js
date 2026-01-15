const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');

const publicBaseUrl = process.env.PUBLIC_BASE_URL || 'http://localhost:3000';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'UniPlus Middleware API',
    version: '1.0.0',
    description:
      'API middleware para UniPlus + Supabase. Auth: Authorization: Basic base64(usuario:senha).',
  },
  tags: [
    { name: 'Pedidos', description: 'Operacoes de DAVs (pedidos, orcamentos, pre-vendas)' },
    { name: 'Entidades', description: 'Clientes, fornecedores, transportadoras, vendedores' },
    { name: 'Produtos', description: 'Produtos e servicos' },
    { name: 'OrdensServico', description: 'Consulta de ordens de servico' },
  ],
  servers: [
    {
      url: publicBaseUrl,
      description: 'URL base da API',
    },
  ],
  security: [{ basicAuth: [] }],
  components: {
    securitySchemes: {
      basicAuth: {
        type: 'http',
        scheme: 'basic',
      },
    },
    headers: {
      Authorization: {
        description: 'Basic Auth no formato "Basic base64(usuario:senha)"',
        schema: {
          type: 'string',
          example: 'Basic dXN1YXJpbzpzZW5oYQ==',
        },
      },
    },
    parameters: {
      AuthorizationHeader: {
        name: 'Authorization',
        in: 'header',
        required: true,
        description: 'Basic Auth no formato "Basic base64(usuario:senha)"',
        schema: {
          type: 'string',
          example: 'Basic dXN1YXJpbzpzZW5oYQ==',
        },
      },
    },
    schemas: {
      PedidoItem: {
        type: 'object',
        properties: {
          produto: { type: 'string', example: '15' },
          quantidade: { type: 'number', example: 1 },
          precoUnitario: { type: 'number', example: 12.73 },
        },
      },
      Pedido: {
        type: 'object',
        properties: {
          cliente: { type: 'string', example: '251' },
          filial: { type: 'string', example: '1' },
          tipoDocumento: { type: 'number', example: 2 },
          condicaoPagamento: { type: 'string', example: '1' },
          data: { type: 'string', example: '2024-09-18' },
          itens: {
            type: 'array',
            items: { $ref: '#/components/schemas/PedidoItem' },
          },
        },
      },
      PedidoWrapper: {
        type: 'object',
        properties: {
          dav: { $ref: '#/components/schemas/Pedido' },
        },
      },
      Entidade: {
        type: 'object',
        properties: {
          codigo: { type: 'string', example: '251' },
          nome: { type: 'string', example: 'Cliente Teste' },
          cnpjCpf: { type: 'string', example: '12345678901' },
          tipo: { type: 'string', example: '1' },
        },
      },
      EntidadeWrapper: {
        type: 'object',
        properties: {
          entidade: { $ref: '#/components/schemas/Entidade' },
        },
      },
      Produto: {
        type: 'object',
        properties: {
          codigo: { type: 'string', example: '15' },
          nome: { type: 'string', example: 'AGUA SANITARIA OLIMPO 2X5L' },
          unidadeMedida: { type: 'string', example: 'UN' },
          preco: { type: 'number', example: 12.73 },
        },
      },
      ProdutoWrapper: {
        type: 'object',
        properties: {
          produto: { $ref: '#/components/schemas/Produto' },
        },
      },
      OrdemServicoItem: {
        type: 'object',
        properties: {
          codigoProduto: { type: 'string', example: '1021' },
          nomeProduto: { type: 'string', example: 'Servico nao tributado' },
          quantidade: { type: 'string', example: '1.000000' },
          preco: { type: 'string', example: '50.000000' },
        },
      },
      OrdemServico: {
        type: 'object',
        properties: {
          codigo: { type: 'string', example: '10' },
          codigoCliente: { type: 'string', example: '139' },
          nomeCliente: { type: 'string', example: 'LUCAS MARTINS MENDES' },
          status: { type: 'number', example: 1 },
          dataOrdemServico: { type: 'string', example: '2023-05-31' },
          itens: {
            type: 'array',
            items: { $ref: '#/components/schemas/OrdemServicoItem' },
          },
        },
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: [path.join(__dirname, '..', 'routes', '*.js')],
};

module.exports = swaggerJSDoc(options);
