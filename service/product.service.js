const productModel = require('../models/product.model');
const fileService = require('./file.service');

class ProductService {
  async getAll() {
    const products = await productModel.find();
    return products;
  }

  async createProduct(product, picture) {
    const fileName = fileService.save(picture);

    const newProduct = await productModel.create({
      ...product,
      imageUrl: fileName,
    });
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

  async getOne(id) {
    return await productModel.findById(id);
  }
}

module.exports = new ProductService();
