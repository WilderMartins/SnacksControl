const { Model, DataTypes } = require('sequelize');

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        barcode: DataTypes.STRING,
        image_url: DataTypes.STRING,
        price: DataTypes.DECIMAL,
        stock_quantity: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
    this.hasMany(models.Consumption, { foreignKey: 'product_id', as: 'consumptions' });
  }
}

module.exports = Product;
