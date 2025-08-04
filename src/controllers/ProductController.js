const fs = require('fs');
const csv = require('csv-parser');
const Product = require('../models/Product');

class ProductController {
  async bulkStore(req, res) {
    const { file } = req;
    const products = [];

    fs.createReadStream(file.path)
      .pipe(csv())
      .on('data', (data) => products.push(data))
      .on('end', async () => {
        try {
          await Product.bulkCreate(products, { ignoreDuplicates: true });
          fs.promises.unlink(file.path); // Remove o arquivo temporário
          return res.status(201).send();
        } catch (error) {
          console.error(error);
          return res.status(400).json({ error: 'Failed to bulk create products.' });
        }
      });
  }

  async store(req, res) {
    const { barcode, category_id, stock_quantity } = req.body;

    if (await Product.findOne({ where: { barcode } })) {
      return res.status(400).json({ error: 'Product already exists' });
    }

    const product = await Product.create({ ...req.body, categoryId: category_id, stock_quantity });

    return res.status(201).json(product);
  }

  async index(req, res) {
    const products = await Product.findAll({ include: ['category'] });

    return res.json(products);
  }

  async delete(req, res) {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(400).json({ error: 'Product not found' });
    }

    await product.destroy();

    return res.status(204).send();
  }

  async update(req, res) {
    const { id } = req.params;
    const { name, barcode, category_id, image_url, stock_quantity } = req.body;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(400).json({ error: 'Product not found' });
    }

    await product.update({ name, barcode, categoryId: category_id, image_url, stock_quantity });

    return res.json(product);
  }
}

module.exports = new ProductController();
