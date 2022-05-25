const express = require('express');

const router = express.Router()
const controllers = require('../controllers/index')
const { authMiddleware } = require('../middlewares/auth.js')

router.get('/products', [authMiddleware], controllers.ordersController.products)
router.post('/product/:id', [authMiddleware], controllers.ordersController.addProducts)

router.post('/', [authMiddleware], controllers.ordersController.create)
router.get('/', [authMiddleware], controllers.ordersController.read)
router.get('/:id', [authMiddleware], controllers.ordersController.readOne)
router.put('/:id', [authMiddleware], controllers.ordersController.confirm)
router.patch('/:id', [authMiddleware], controllers.ordersController.checkOut)
router.delete('/:id', [authMiddleware], controllers.ordersController.delete)

module.exports = {
  basePath: '/orders',
  router,
}
