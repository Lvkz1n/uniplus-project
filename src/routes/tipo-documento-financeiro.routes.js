const express = require('express');

const tipoDocumentoService = require('../services/tipo-documento-financeiro.service');

const router = express.Router();

/**
 * @openapi
 * /api/tipos-documentos-financeiros:
 *   get:
 *     summary: Lista tipos de documentos financeiros
 *     tags: [TiposDocumentosFinanceiros]
 *     parameters:
 *       - in: query
 *         name: codigo
 *         schema:
 *           type: string
 *         description: Codigo do tipo de documento
 *         example: "20"
 *       - in: query
 *         name: descricao
 *         schema:
 *           type: string
 *         description: Descricao do tipo de documento
 *         example: "DINHEIRO"
 *     responses:
 *       200:
 *         description: Lista de tipos de documentos financeiros
 */
router.get('/api/tipos-documentos-financeiros', async (req, res, next) => {
  try {
    const options = { params: req.query };
    const data = await tipoDocumentoService.listarTiposDocumentoFinanceiro(options);
    return res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /api/tipos-documentos-financeiros/{codigo}:
 *   get:
 *     summary: Busca tipo de documento financeiro por codigo
 *     tags: [TiposDocumentosFinanceiros]
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *         example: "20"
 *     responses:
 *       200:
 *         description: Tipo de documento encontrado
 */
router.get('/api/tipos-documentos-financeiros/:codigo', async (req, res, next) => {
  try {
    const { codigo } = req.params;
    if (!codigo) {
      return res.status(400).json({ success: false, error: 'Codigo obrigatorio.' });
    }

    const data = await tipoDocumentoService.obterTipoDocumentoFinanceiroPorCodigo(codigo);
    return res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
