const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        otp: DataTypes.STRING,
        otp_expires_at: DataTypes.DATE,
        daily_credits: DataTypes.INTEGER,
        role: DataTypes.ENUM('admin', 'manager', 'user'),
        is_active: DataTypes.BOOLEAN,
      },
      {
        sequelize,
        hooks: {
          beforeSave: async (user) => {
            if (user.password) {
              user.password = await bcrypt.hash(user.password, 8);
            }
          },
        },
      }
    );

    return this;
  }

  async checkPassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  static associate(models) {
    this.hasMany(models.Consumption, { foreignKey: 'user_id', as: 'consumptions' });
  }
}

module.exports = User;
