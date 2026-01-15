const express = require('express');

const ordensServicoService = require('../services/ordens-servico.service');

const router = express.Router();

/**
 * @openapi
 * /api/ordens-servico:
 *   get:
 *     summary: Lista ordens de servico
 *     tags: [OrdensServico]
 *     parameters:
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
 *     responses:
 *       200:
 *         description: Lista de ordens de servico
 */
router.get('/api/ordens-servico', async (req, res, next) => {
  try {
    const { single, ...raw } = req.query;
    const options = { params: raw };

    if (options.params.limit !== undefined) {
      options.params.limit = Number(options.params.limit);
    }
    if (options.params.offset !== undefined) {
      options.params.offset = Number(options.params.offset);
    }

    const data = await ordensServicoService.listarOrdensServico(options);

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
 * /api/ordens-servico/{codigo}:
 *   get:
 *     summary: Busca ordem de servico por codigo
 *     tags: [OrdensServico]
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ordem de servico encontrada
 */
router.get('/api/ordens-servico/:codigo', async (req, res, next) => {
  try {
    const { codigo } = req.params;
    if (!codigo) {
      return res.status(400).json({ success: false, error: 'Codigo obrigatorio.' });
    }

    try {
      const data = await ordensServicoService.obterOrdemServicoPorCodigo(codigo);
      return res.json({ success: true, data });
    } catch (error) {
      if (error.status !== 422) {
        throw error;
      }

      const data = await ordensServicoService.listarOrdensServico({
        params: { 'codigo.eq': codigo },
      });

      if (Array.isArray(data) && data.length === 0) {
        return res.status(404).json({ success: false, error: 'Ordem de servico nao encontrada.' });
      }

      const primeiro = Array.isArray(data) ? data[0] : data;
      return res.json({ success: true, data: primeiro });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
