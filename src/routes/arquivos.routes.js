const express = require('express');

const arquivosService = require('../services/arquivos.service');

const router = express.Router();

/**
 * @openapi
 * /api/arquivos:
 *   get:
 *     summary: Lista arquivos exportados (XML fiscal)
 *     tags: [ArquivosFiscais]
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *         description: "Tipo do arquivo (ex: DOCUMENTO_FISCAL)"
 *         example: "DOCUMENTO_FISCAL"
 *     responses:
 *       200:
 *         description: Lista de arquivos disponiveis
 */
router.get('/api/arquivos', async (req, res, next) => {
  try {
    const { tipo } = req.query;
    if (!tipo) {
      return res.status(400).json({
        success: false,
        error: 'Parametro tipo e obrigatorio (ex: DOCUMENTO_FISCAL).',
      });
    }

    const options = { params: req.query };
    const data = await arquivosService.listarArquivos(options);
    return res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
