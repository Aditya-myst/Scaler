'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
      OrderItem.belongsTo(models.Order, { foreignKey: 'order_id', as: 'Order' });
      OrderItem.belongsTo(models.Product, { foreignKey: 'product_id', as: 'Product' });
    }
  }

  OrderItem.init(
    {
      order_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
      },
      product_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
      },
      quantity: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        defaultValue: 1 
      },
      price: { 
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false 
      }
    },
    {
      sequelize,
      modelName: 'OrderItem',
      tableName: 'order_items',
      underscored: true,
      timestamps: true
    }
  );

  return OrderItem;
};