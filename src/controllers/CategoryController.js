const Category = require('../models/Category');

class CategoryController {
  async store(req, res) {
    const { name } = req.body;

    if (await Category.findOne({ where: { name } })) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    const category = await Category.create(req.body);

    return res.status(201).json(category);
  }

  async update(req, res) {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    const updatedCategory = await category.update(req.body);

    return res.json(updatedCategory);
  }

  async index(req, res) {
    const categories = await Category.findAll();

    return res.json(categories);
  }

  async delete(req, res) {
    const { id } = req.params;

    await Category.destroy({ where: { id } });

    return res.status(204).send();
  }
}

module.exports = new CategoryController();
