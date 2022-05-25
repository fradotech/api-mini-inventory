const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      models.Order.belongsTo(models.User)
      models.User.hasMany(models.Order)
    }
  }
  Order.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      status: {
        type: DataTypes.INTEGER,
      },
      totalIncome: {
        type: DataTypes.INTEGER,
      },
      customerName: {
        type: DataTypes.STRING,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "id"
        }
      },
    },
    {
      sequelize,
      tableName: 'orders',
      modelName: 'Order',
    },
  )
  return Order;
}
