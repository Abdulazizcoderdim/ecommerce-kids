const productService = require('../service/product.service');

class ProductController {
  async getAll(req, res) {
    try {
      const allProducts = await productService.getAll();
      res.status(200).json(allProducts);
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log(error);
    }
  }
  async createProduct(req, res) {
    try {
      const newProduct = await productService.createProduct(req.body);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log(error);
    }
  }

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const updatedProduct = await productService.updateProduct(id, req.body);
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log(error);
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const deletedProduct = await productService.deleteProduct(id);
      res.status(200).json(deletedProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log(error);
    }
  }
}

module.exports = new ProductController();
