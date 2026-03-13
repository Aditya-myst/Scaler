'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    static associate(models) {
      CartItem.belongsTo(models.Cart, { foreignKey: 'cart_id', as: 'Cart' });
      CartItem.belongsTo(models.Product, { foreignKey: 'product_id', as: 'Product' });
    }
  }

  CartItem.init(
    {
      cart_id: {
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
      modelName: 'CartItem',
      tableName: 'cart_items',
      underscored: true,
      timestamps: true
    }
  );

  return CartItem;
};