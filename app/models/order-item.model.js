const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
      models.OrderItem.belongsTo(models.Order)
      models.Order.hasMany(models.OrderItem)

      models.OrderItem.belongsTo(models.Product)
      models.Product.hasMany(models.OrderItem)
    }
  }
  OrderItem.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      subtotalGroceryPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subtotalSellPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subtotalIncome: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Order",
          key: "id"
        },
        onDelete: 'CASCADE',
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Product",
          key: "id"
        }
      },
    },
    {
      sequelize,
      tableName: 'order_items',
      modelName: 'OrderItem',
    },
  )
  return OrderItem;
}
