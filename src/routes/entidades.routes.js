const express = require('express');

const entidadesService = require('../services/entidades.service');

const router = express.Router();

/**
 * @openapi
 * /api/entidades:
 *   get:
 *     summary: Lista entidades (clientes/fornecedores)
 *     tags: [Entidades]
 *     parameters:
 *       - in: query
 *         name: codigo
 *         schema:
 *           type: string
 *         description: Filtra por codigo
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtra por nome (prefixo)
 *       - in: query
 *         name: cnpjCpf
 *         schema:
 *           type: string
 *         description: Filtra por CNPJ/CPF
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limite de registros
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Offset de pagina
 *       - in: query
 *         name: single
 *         schema:
 *           type: boolean
 *         description: Retorna apenas um registro
 *       - in: query
 *         name: all
 *         schema:
 *           type: boolean
 *         description: Retorna todos os registros ignorando paginacao
 *     responses:
 *       200:
 *         description: Lista de entidades
 *         content:
 *           application/json:
 *             examples:
 *               sucesso:
 *                 value:
 *                   success: true
 *                   data:
 *                     - codigo: "251"
 *                       nome: "Cliente Teste"
 *                       cnpjCpf: "12345678901"
 */

router.get('/api/entidades', async (req, res, next) => {
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
    if (all !== undefined) {
      options.all = all === 'true';
    } else if (
      options.params.limit === undefined
      && options.params.offset === undefined
      && single !== 'true'
    ) {
      options.all = true;
    }

    const data = await entidadesService.listarEntidades(options, context);

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
 * /api/entidades/{codigo}:
 *   get:
 *     summary: Busca entidade por codigo
 *     tags: [Entidades]
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Entidade encontrada
 */
router.get('/api/entidades/:codigo', async (req, res, next) => {
  try {
    const { codigo } = req.params;
    const context = { rota: req.path, metodo: req.method };
    if (!codigo) {
      return res.status(400).json({ success: false, error: 'Codigo obrigatorio.' });
    }

    const data = await entidadesService.obterEntidadePorCodigo(codigo, context);
    return res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /api/entidades:
 *   post:
 *     summary: Cria uma entidade (cliente/fornecedor)
 *     tags: [Entidades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EntidadeWrapper'
 *           examples:
 *             basico:
 *               value:
 *                 entidade:
 *                   codigo: "3001"
 *                   nome: "Cliente Exemplo"
 *                   tipo: "1"
 *                   tipoPessoa: "0"
 *                   cnpjCpf: "12345678901"
 *     responses:
 *       200:
 *         description: Entidade criada
 *         content:
 *           application/json:
 *             examples:
 *               sucesso:
 *                 value:
 *                   success: true
 */
router.post('/api/entidades', async (req, res, next) => {
  try {
    const payload = req.body?.entidade ? req.body.entidade : req.body;
    const context = { rota: req.path, metodo: req.method };

    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ success: false, error: 'Payload invalido.' });
    }

    if (!payload.nome) {
      return res.status(400).json({ success: false, error: 'Campo "nome" e obrigatorio.' });
    }

    if (!payload.tipo) {
      return res.status(400).json({ success: false, error: 'Campo "tipo" e obrigatorio.' });
    }

    const tipos = String(payload.tipo)
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const tipoInvalido = tipos.some((tipo) => !['1', '2', '3', '4', '5', '6'].includes(tipo));
    if (tipoInvalido) {
      return res.status(400).json({ success: false, error: 'Campo "tipo" invalido.' });
    }

    if (payload.tipoPessoa !== undefined) {
      const tipoPessoa = String(payload.tipoPessoa);
      if (!['0', '1'].includes(tipoPessoa)) {
        return res.status(400).json({ success: false, error: 'Campo "tipoPessoa" invalido.' });
      }

      if (tipoPessoa === '1' && !payload.cnpjCpf) {
        return res.status(400).json({
          success: false,
          error: 'Campo "cnpjCpf" e obrigatorio para pessoa juridica.',
        });
      }
    }

    if (payload.cnpjCpf) {
      const apenasDigitos = String(payload.cnpjCpf).replace(/\D/g, '');
      if (apenasDigitos.length !== 11 && apenasDigitos.length !== 14) {
        return res.status(400).json({ success: false, error: 'Campo "cnpjCpf" invalido.' });
      }
    }

    const data = await entidadesService.criarEntidade(
      req.body?.entidade ? req.body : { entidade: payload },
      context,
    );
    return res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /api/entidades:
 *   put:
 *     summary: Atualiza uma entidade
 *     tags: [Entidades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EntidadeWrapper'
 *           examples:
 *             atualizacao:
 *               value:
 *                 entidade:
 *                   codigo: "251"
 *                   nome: "Cliente Atualizado"
 *                   tipo: "1"
 *     responses:
 *       200:
 *         description: Entidade atualizada
 *         content:
 *           application/json:
 *             examples:
 *               sucesso:
 *                 value:
 *                   success: true
 */
router.put('/api/entidades', async (req, res, next) => {
  try {
    const payload = req.body?.entidade ? req.body.entidade : req.body;
    const context = { rota: req.path, metodo: req.method };

    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ success: false, error: 'Payload invalido.' });
    }

    if (!payload.codigo) {
      return res.status(400).json({ success: false, error: 'Campo "codigo" e obrigatorio.' });
    }

    if (!payload.nome) {
      return res.status(400).json({ success: false, error: 'Campo "nome" e obrigatorio.' });
    }

    if (!payload.tipo) {
      return res.status(400).json({ success: false, error: 'Campo "tipo" e obrigatorio.' });
    }

    const tipos = String(payload.tipo)
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const tipoInvalido = tipos.some((tipo) => !['1', '2', '3', '4', '5', '6'].includes(tipo));
    if (tipoInvalido) {
      return res.status(400).json({ success: false, error: 'Campo "tipo" invalido.' });
    }

    if (payload.tipoPessoa !== undefined) {
      const tipoPessoa = String(payload.tipoPessoa);
      if (!['0', '1'].includes(tipoPessoa)) {
        return res.status(400).json({ success: false, error: 'Campo "tipoPessoa" invalido.' });
      }

      if (tipoPessoa === '1' && !payload.cnpjCpf) {
        return res.status(400).json({
          success: false,
          error: 'Campo "cnpjCpf" e obrigatorio para pessoa juridica.',
        });
      }
    }

    if (payload.cnpjCpf) {
      const apenasDigitos = String(payload.cnpjCpf).replace(/\D/g, '');
      if (apenasDigitos.length !== 11 && apenasDigitos.length !== 14) {
        return res.status(400).json({ success: false, error: 'Campo "cnpjCpf" invalido.' });
      }
    }

    const data = await entidadesService.atualizarEntidade(
      req.body?.entidade ? req.body : { entidade: payload },
      context,
    );
    return res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /api/entidades/{codigo}:
 *   delete:
 *     summary: Apaga entidade por codigo
 *     tags: [Entidades]
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Entidade apagada
 *         content:
 *           application/json:
 *             examples:
 *               sucesso:
 *                 value:
 *                   success: true
 */
router.delete('/api/entidades/:codigo', async (req, res, next) => {
  try {
    const { codigo } = req.params;
    const context = { rota: req.path, metodo: req.method };
    if (!codigo) {
      return res.status(400).json({ success: false, error: 'Codigo obrigatorio.' });
    }

    const data = await entidadesService.apagarEntidade(codigo, context);
    return res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
