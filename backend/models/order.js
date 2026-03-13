'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'user_id', as: 'User' });
      Order.hasMany(models.OrderItem, { foreignKey: 'order_id', as: 'OrderItems' });
    }
  }

  Order.init(
    {
      user_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
      },
      total_price: { 
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false 
      },
      shipping_address: { 
        type: DataTypes.JSONB, 
        allowNull: false 
      },
      status: { 
        type: DataTypes.ENUM('pending', 'shipped', 'delivered', 'cancelled'), 
        allowNull: false, 
        defaultValue: 'pending' 
      },
      order_date: { 
        type: DataTypes.DATE, 
        allowNull: false, 
        defaultValue: DataTypes.NOW 
      }
    },
    {
      sequelize,
      modelName: 'Order',
      tableName: 'orders',
      underscored: true,
      timestamps: true
    }
  );

  return Order;
};