const path = require('path')
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin')
const csrf =require('../midelleware/csrf');
const isAdmin = require('../midelleware/isAdmin');

router.get('/products',csrf,isAdmin,adminController.getProducts)
router.get('/add-product',csrf,isAdmin,adminController.getAddProduct)
router.post('/add-product',csrf,isAdmin,adminController.postAddProduct)
router.get('/products/:productid',csrf,isAdmin,adminController.getEditProduct)
router.post('/products',csrf,isAdmin,adminController.postEditProduct)
router.post('/delete-product',csrf,isAdmin, adminController.postDeleteProduct)

router.get('/categories',csrf,isAdmin,adminController.getCategories)
router.get('/add-category',csrf,isAdmin,adminController.getAddCategory)
router.post('/add-category',csrf,isAdmin,adminController.postAddCategory)
router.get('/categories/:categoryid',csrf,isAdmin,adminController.getEditCategory)
router.post('/categories/',csrf,isAdmin,adminController.postEditCategory)
router.post('/delete-category',csrf,isAdmin,adminController.postDeleteCategory)
module.exports = router;
