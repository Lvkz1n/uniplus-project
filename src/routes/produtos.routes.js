const express = require('express');

const produtosService = require('../services/produtos.service');

const router = express.Router();
const DEFAULT_LIMIT = 25;

/**
 * @openapi
 * /api/produtos:
 *   get:
 *     summary: Lista produtos
 *     tags: [Produtos]
 *     parameters:
 *       - in: query
 *         name: codigo
 *         schema:
 *           type: string
 *         description: Filtra por codigo
 *         example: "15"
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtra por nome (prefixo)
 *         example: "AGUA"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limite de registros
 *         example: 100
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Offset de pagina
 *         example: 0
 *       - in: query
 *         name: single
 *         schema:
 *           type: boolean
 *         description: Retorna apenas um registro
 *         example: false
 *       - in: query
 *         name: all
 *         schema:
 *           type: boolean
 *         description: Retorna todos os registros ignorando paginacao
 *         example: true
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             examples:
 *               sucesso:
 *                 value:
 *                   success: true
 *                   data:
 *                     - codigo: "15"
 *                       nome: "AGUA SANITARIA OLIMPO 2X5L"
 *                       unidadeMedida: "UN"
 *                       preco: 12.73
 */

router.get('/api/produtos', async (req, res, next) => {
  try {
    const { single, all, ...raw } = req.query;
    const options = { params: raw };
    const context = { rota: req.path, metodo: req.method };

    if (options.params.limit !== undefined) {
      options.params.limit = Number(options.params.limit);
    }
    if (options.params.offset !== undefined) {
      options.params.offset = Number(options.params.offset);
    }
    const limitValue = options.params.limit;
    const offsetValue = options.params.offset;

    if (all !== undefined) {
      options.all = all === 'true';
    } else if (single === 'true') {
      options.all = false;
    } else if (offsetValue !== undefined) {
      options.all = false;
    } else if (limitValue !== undefined) {
      options.all = Number(limitValue) === DEFAULT_LIMIT;
    } else {
      options.all = true;
    }

    const data = await produtosService.listarProdutos(options, context);

    if (single === 'true') {
      const primeiro = Array.isArray(data) ? data[0] || null : data || null;
      return res.json({ success: true, data: primeiro });
    }

    return res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /api/produtos/{codigo}:
 *   get:
 *     summary: Busca produto por codigo
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *         example: "15"
 *     responses:
 *       200:
 *         description: Produto encontrado
 */
router.get('/api/produtos/:codigo', async (req, res, next) => {
  try {
    const { codigo } = req.params;
    const context = { rota: req.path, metodo: req.method };
    if (!codigo) {
      return res.status(400).json({ success: false, error: 'Codigo obrigatorio.' });
    }

    const data = await produtosService.obterProdutoPorCodigo(codigo, context);
    return res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /api/produtos:
 *   post:
 *     summary: Cria um produto
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProdutoWrapper'
 *           examples:
 *             basico:
 *               value:
 *                 produto:
 *                   codigo: "9001"
 *                   nome: "Produto Exemplo"
 *                   unidadeMedida: "UN"
 *                   preco: 9.99
 *     responses:
 *       201:
 *         description: Produto criado
 *         content:
 *           application/json:
 *             examples:
 *               sucesso:
 *                 value:
 *                   success: true
 */
router.post('/api/produtos', async (req, res, next) => {
  try {
    const payload = req.body?.produto ? req.body.produto : req.body;
    const context = { rota: req.path, metodo: req.method };

    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ success: false, error: 'Payload invalido.' });
    }

    if (!payload.nome || !payload.unidadeMedida || payload.preco === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatorios: nome, unidadeMedida, preco.',
      });
    }

    if (!Number.isFinite(Number(payload.preco))) {
      return res.status(400).json({ success: false, error: 'Campo "preco" invalido.' });
    }

    const data = await produtosService.criarProduto(
      req.body?.produto ? req.body : { produto: payload },
      context,
    );
    return res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /api/produtos:
 *   put:
 *     summary: Atualiza um produto
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProdutoWrapper'
 *           examples:
 *             atualizacao:
 *               value:
 *                 produto:
 *                   codigo: "15"
 *                   nome: "Produto Atualizado"
 *                   unidadeMedida: "UN"
 *                   preco: 12.73
 *     responses:
 *       200:
 *         description: Produto atualizado
 *         content:
 *           application/json:
 *             examples:
 *               sucesso:
 *                 value:
 *                   success: true
 */
router.put('/api/produtos', async (req, res, next) => {
  try {
    const payload = req.body?.produto ? req.body.produto : req.body;
    const context = { rota: req.path, metodo: req.method };

    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ success: false, error: 'Payload invalido.' });
    }

    if (!payload.codigo) {
      return res.status(400).json({ success: false, error: 'Campo "codigo" e obrigatorio.' });
    }

    if (!payload.nome || !payload.unidadeMedida || payload.preco === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatorios: codigo, nome, unidadeMedida, preco.',
      });
    }

    if (!Number.isFinite(Number(payload.preco))) {
      return res.status(400).json({ success: false, error: 'Campo "preco" invalido.' });
    }

    const data = await produtosService.atualizarProduto(
      req.body?.produto ? req.body : { produto: payload },
      context,
    );
    return res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /api/produtos/{codigo}:
 *   delete:
 *     summary: Apaga produto por codigo
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *         example: "15"
 *     responses:
 *       200:
 *         description: Produto apagado
 *         content:
 *           application/json:
 *             examples:
 *               sucesso:
 *                 value:
 *                   success: true
 */
router.delete('/api/produtos/:codigo', async (req, res, next) => {
  try {
    const { codigo } = req.params;
    const context = { rota: req.path, metodo: req.method };
    if (!codigo) {
      return res.status(400).json({ success: false, error: 'Codigo obrigatorio.' });
    }

    const data = await produtosService.apagarProduto(codigo, context);
    return res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
