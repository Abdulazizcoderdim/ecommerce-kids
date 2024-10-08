const express = require('express');
const productController = require('../controllers/product.controller');
const router = express.Router();

router.get('/', productController.getAll);
router.get('/:id', productController.getOne);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);


module.exports = router;
