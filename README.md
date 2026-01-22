# Uniplus-project-API

API Node.js/Express que integra com a UniPlus (public-api) e expõe endpoints para entidades (clientes/fornecedores), produtos, pedidos, ordens de servico, vendas, estoque, arquivos fiscais, tipos de documentos financeiros e Gourmet. Inclui auditoria via Supabase e documentacao OpenAPI.

## Principais recursos
- Proxy seguro para a UniPlus com renovacao automatica de token.
- Endpoints REST para entidades, produtos, pedidos, ordens de servico e consultas adicionais.
- Auditoria de operacoes em tabela (Supabase) com trilha de sucesso/falha.
- Documentacao OpenAPI (Swagger UI).
- Suporte a paginação e coleta completa de registros.

## Arquitetura (alto nivel)
- `src/app.js`: Configuracao do Express e middlewares globais.
- `src/routes/*.routes.js`: Rotas HTTP.
- `src/services/*.service.js`: Regras de negocio, auditoria e integracao UniPlus.
- `src/config/uniplus.js`: Cliente Axios + autenticacao.
- `src/config/supabase.js`: Cliente Supabase para auditoria.

## Requisitos
- Node.js 18+ (testado com Node 22).
- Credenciais UniPlus para `public-api`.
- Supabase (opcional, mas recomendado para auditoria).

## Variaveis de ambiente
Crie um arquivo `.env` com valores.

```
UNIPLUS_BASE_URL=https://exemplo.com/public-api
UNIPLUS_SERVER_URL=https://exemplo.com
UNIPLUS_AUTH_BASIC=BASE64_CLIENTID_CLIENTSECRET
UNIPLUS_CLIENT_ID=seu_client_id
UNIPLUS_CLIENT_SECRET=seu_client_secret
UNIPLUS_TOKEN=

BASIC_AUTH_USER=usuario_api
BASIC_AUTH_PASS=senha_api

SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=chave_service_role

UNIPLUS_ALL_LIMIT=100

PORTAL_BASE_URL=url do seu portal 
PORTAL_API_TOKEN=token_do_portal
```

### Observacoes
- `UNIPLUS_TOKEN` e opcional. Quando vazio, o token e obtido via OAuth.
- `BASIC_AUTH_*` ativa protecao Basic Auth em todas as rotas.
- `UNIPLUS_ALL_LIMIT` define o tamanho da pagina para buscar todos os registros. A UniPlus limita a 100 por pagina, entao use `100`.
- `PORTAL_API_TOKEN` e obrigatorio apenas para os endpoints do Portal Comercial.

## Instalar dependencias
```
npm install
```

## Rodar localmente
```
npm start
```

Se houver script de desenvolvimento no `package.json`:
```
npm run dev
```

## Documentacao da API
- Swagger UI: `http://localhost:PORT/docs`
- OpenAPI JSON: `http://localhost:PORT/openapi.json`

## Endpoints principais
Todas as rotas seguem o prefixo `/api`.

### Entidades
- `GET /api/entidades`
- `GET /api/entidades/:codigo`
- `POST /api/entidades`
- `PUT /api/entidades`
- `DELETE /api/entidades/:codigo`

### Produtos
- `GET /api/produtos`
- `GET /api/produtos/:codigo`
- `POST /api/produtos`
- `PUT /api/produtos`
- `DELETE /api/produtos/:codigo`

### Pedidos
- `GET /api/pedidos`
- `GET /api/pedidos/:codigo`
- `POST /api/pedidos`
- `PUT /api/pedidos`
- `DELETE /api/pedidos/:codigo`

### Ordens de servico
- `GET /api/ordens-servico`
- `GET /api/ordens-servico/:codigo`

### Vendas e estoque (API Vendas)
- `GET /api/vendas`
- `GET /api/vendas/itens`
- `GET /api/estoque/movimentacoes`

### Arquivos fiscais
- `GET /api/arquivos?tipo=DOCUMENTO_FISCAL`

### Tipos de documentos financeiros
- `GET /api/tipos-documentos-financeiros`
- `GET /api/tipos-documentos-financeiros/:codigo`

### Gourmet
- `GET /api/gourmet/contas`
- `POST /api/gourmet/contas`

### Portal Comercial
- `POST /api/portal/bloquear-contrato/:cpfcnpj`
- `POST /api/portal/desbloquear-contrato/:cpfcnpj`
- `GET /api/portal/contratos`
- `GET /api/portal/contratos/:status`
- `GET /api/portal/contrato/:cpfcnpj`
- `GET /api/portal/contrato/:cpfcnpj/:status`

## Paginacao e retorno completo
- Sem `limit/offset`, o servico tenta buscar todas as paginas usando `limit=UNIPLUS_ALL_LIMIT` (maximo 100).
- Para paginar manualmente, use `limit` e `offset`.
- `single=true` retorna apenas o primeiro item.

## Auditoria
Operacoes de listar, consultar, criar, atualizar e apagar sao registradas em tabelas no Supabase:
- `entidades_log`
- `produtos_log`
- `pedidos_log`
- `ordens_servico_log`

Cada registro contem operacao, status, payload e metadados da rota.

## Autenticacao
Se `BASIC_AUTH_USER` e `BASIC_AUTH_PASS` estiverem configurados, todas as rotas exigem Basic Auth.

Exemplo de header:
```
Authorization: Basic BASE64_USUARIO_SENHA
```

## Licenca
Luiz Vasconcelos 01/19/2026
Uso da api para fins comerciais.
