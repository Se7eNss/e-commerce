const express = require('express');
const router = express.Router();
const path = require('path');

const adminRouter = require('./admin')
const isAuthenticated =require('../midelleware/authentication')
const shopController = require('../controllers/shop')
const csrf =require('../midelleware/csrf');

router.get('/',csrf,shopController.getIndex)
router.get('/products',csrf,shopController.getProducts)
router.get('/products/:productid',csrf,shopController.getProduct)
router.get('/categories/:categoryid',csrf,shopController.getProductsByCategoryId)
router.get('/cart',csrf,isAuthenticated,shopController.getCart)
router.post('/cart',csrf,isAuthenticated,shopController.postCart)
router.post('/delete-cartItem',csrf,isAuthenticated,shopController.postDeleteCartItem)
router.get('/orders',csrf,isAuthenticated,shopController.getOrders)
router.post('/create-order',csrf,isAuthenticated,shopController.postOrders)

module.exports = router;