const express = require('express');
const supabase = require('../config/supabase');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check basico da API
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API disponivel
 */
router.get('/health/supabase', async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('pedidos_log').select('id').limit(1);

    if (error) {
      return res.status(503).json({
        success: false,
        status: 'unhealthy',
        error: 'Falha ao acessar o Supabase.',
        details: error.message,
      });
    }

    return res.json({
      success: true,
      status: 'ok',
      sample: data[0] || null,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @openapi
 * /health/supabase:
 *   get:
 *     summary: Health check do Supabase
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Supabase disponivel
 *       503:
 *         description: Supabase indisponivel
 */
module.exports = router;
