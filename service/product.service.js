const productModel = require('../models/product.model');

class ProductService {
  async getAll() {
    const products = await productModel.find();
    return products;
  }

  async createProduct(product) {
    const newProduct = await productModel.create(product);
    return newProduct;
  }

  async updateProduct(id, product) {
    const updatedProduct = await productModel.findByIdAndUpdate(id, product, {
      new: true,
    });
    return updatedProduct;
  }

  async deleteProduct(id) {
    const deletedProduct = await productModel.findByIdAndDelete(id);
    return deletedProduct;
  }
}

module.exports = new ProductService();
