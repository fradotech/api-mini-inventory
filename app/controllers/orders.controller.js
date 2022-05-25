const models = require('../models');
const response = require('../functions/serviceUtil.js');
const CustomError = require('../functions/CustomError');
const client = require('../config/redis.config');

module.exports = {
  name: 'ordersController',

  products: async (req, res, next) => {
    try {
      // client.del('products')
      const productsCache = await client.get('products')

      if(productsCache) {
        console.log('Cache Product List')
        res.status(200).send(response.getResponseCustom(200, JSON.parse(productsCache)))
      }

      else {
        // Start Transaction
        const result = await models.sequelize.transaction(async (transaction) => {
          const products = await models.Product.findAll({ transaction })
          await client.set('products', JSON.stringify(products))

          return products
        })
        
        // Transaction complete!
        res.status(200).send(response.getResponseCustom(200, result))
        res.end()
      }

    } catch (error) {
      // Transaction Failed!
      next(error)
    }
  },

  create: async (req, res, next) => {
    try {
      client.del('orders') // Remove cache
      
      // Start Transaction
      const result = await models.sequelize.transaction(async (transaction) => {
        if (!req.body.customerName) req.body.customerName = 'Anonymous'

        const user = (await models.User.findByPk(req.user.id, { transaction })).dataValues

        // Membuat record order dahulu dengan item yang masih kosong
        const order = new models.Order().dataValues

        order.customerName = req.body.customerName
        order.status = false
        order.userId = user.id

        const createdOrder = await models.Order.create(order, { transaction })
        
        return createdOrder
      })
      // Transaction complete!
      res.status(200).send(response.getResponseCustom(200, result))
      res.end()
    } catch (error) {
      // Transaction Failed!
      next(error)
    }
  },

  addProducts: async (req, res, next) => {
    try {
      client.del('orders') // Remove cache
      client.del(`order[${req.params.id}]`) // Remove cache
      
      // Start Transaction
      const result = await models.sequelize.transaction(async (transaction) => {
        const order = (await models.Order.findByPk(req.params.id, { transaction }))
        if (!order) throw new CustomError('Order not found', 404)

        const product = (await models.Product.findByPk(req.body.productId, { transaction }))
        if (!product) throw new CustomError('Product not found', 404)

        const orderItem = {}

        orderItem.orderId = order.id
        orderItem.productId = product.id

        // Fitur utama kalkulasi keuntungan pada variabel subtotalIncome
        orderItem.quantity = req.body.quantity
        orderItem.subtotalGroceryPrice = product.groceryPrice * orderItem.quantity
        orderItem.subtotalSellPrice = product.sellPrice * orderItem.quantity
        orderItem.subtotalIncome = orderItem.subtotalSellPrice - orderItem.subtotalGroceryPrice

        // Menyimpan orderItem 1 per 1 ke database dengan db transaction untuk menghindari kegagalan store data
        const createdOrderItem = await models.OrderItem.create(orderItem, { transaction })
        
        return createdOrderItem
      })
      // Transaction complete!
      res.status(200).send(response.getResponseCustom(200, result))
      res.end()
    } catch (error) {
      // Transaction Failed!
      next(error)
    }
  },

  read: async (req, res, next) => {
    try {
      const ordersCache = await client.get('orders')

      if(ordersCache) {
        console.log('Cache Order List')
        res.status(200).send(response.getResponseCustom(200, JSON.parse(ordersCache)))
      }

      else {
        // Start Transaction
        const result = await models.sequelize.transaction(async (transaction) => {
          const orders = await models.Order.findAll({ 
            include: {
              model: models.OrderItem,
              include: {
                model: models.Product,
              }, 
            }, 
            transaction 
          })
          
          await client.set('orders', JSON.stringify(orders))

          return orders
        })
        // Transaction complete!
        res.status(200).send(response.getResponseCustom(200, result))
        res.end()
      }
    } catch (error) {
      // Transaction Failed!
      next(error)
    }
  },

  readOne: async (req, res, next) => {
    try {
      const orderCache = await client.get(`order[${req.params.id}]`)

      if(orderCache) {
        console.log('Cache Product List')
        res.status(200).send(response.getResponseCustom(200, JSON.parse(orderCache)))
      }

      else {
       // Start Transaction
        const result = await models.sequelize.transaction(async (transaction) => {
          const order = await models.Order.findByPk(req.params.id, { 
            include: {
              model: models.OrderItem,
              include: {
                model: models.Product,
              }, 
            }, 
            transaction 
          })

          if (!order) throw new CustomError('Order not found', 404)
          
          await client.set(`order[${order.id}]`, JSON.stringify(order))
          
          return order
        })
        // Transaction complete!
        res.status(200).send(response.getResponseCustom(200, result))
        res.end() 
      }
    } catch (error) {
      // Transaction Failed!
      next(error)
    }
  },

  confirm: async (req, res, next) => {
    try {
      client.del('orders') // Remove cache
      client.del(`order[${req.params.id}]`) // Remove cache
      
      // Start Transaction
      const result = await models.sequelize.transaction(async (transaction) => {
        const order = await models.Order.findByPk(req.params.id, { 
          include: {
            model: models.OrderItem,
            include: {
              model: models.Product,
            }, 
          }, 
          transaction 
        })

        order.status = req.body.status
        order.customerName = req.body.customerName
        
        order.totalIncome = 0

        order.OrderItems.forEach(async orderItem => {
          order.totalIncome += orderItem.subtotalIncome
          
          orderItem.Product.stock -= orderItem.quantity

          await orderItem.Product.save({ transaction })
        })
        
        const confirmedOrder = await order.save({ transaction })

        return confirmedOrder
      })
      // Transaction complete!
      res.status(200).send(response.getResponseCustom(200, result))
      res.end()
    } catch (error) {
      // Transaction Failed!
      next(error)
    }
  },

  checkOut: async (req, res, next) => {
    try {
      client.del('orders') // Remove cache
      client.del(`order[${req.params.id}]`) // Remove cache

      // Start Transaction
      const result = await models.sequelize.transaction(async (transaction) => {
        const order = await models.Order.findByPk(req.params.id, { 
          include: {
            model: models.OrderItem,
            include: {
              model: models.Product,
            }, 
          }, 
          transaction 
        })

        order.status = req.body.status
        
        const confirmedOrder = await order.save({ transaction })

        return confirmedOrder
      })
      // Transaction complete!
      res.status(200).send(response.getResponseCustom(200, result))
      res.end()
    } catch (error) {
      // Transaction Failed!
      next(error)
    }
  },

  delete: async (req, res, next) => {
    try {
      client.del('orders') // Remove cache
      client.del(`order[${req.params.id}]`) // Remove cache

      // Start Transaction
      const result = await models.sequelize.transaction(async (transaction) => {
        const order = await models.Order.findByPk(req.params.id, { 
          include: {
            model: models.OrderItem,
            include: {
              model: models.Product,
            }, 
          }, 
          transaction 
        })
        if (!order) throw new CustomError('Order not found', 404)

        const deletedOrder = await order.destroy({ transaction })
        
        return deletedOrder
      })
      // Transaction complete!
      res.status(200).send(response.getResponseCustom(200, result))
      res.end()
    } catch (error) {
      // Transaction Failed!
      next(error)
    }
  },
}
