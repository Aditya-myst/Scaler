'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      Cart.belongsTo(models.User, { foreignKey: 'user_id', as: 'User' });
      Cart.hasMany(models.CartItem, { foreignKey: 'cart_id', as: 'CartItems' });
    }
  }

  Cart.init(
    {
      user_id: { 
        type: DataTypes.INTEGER, 
        allowNull: true 
      },
      total_price: { 
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false, 
        defaultValue: 0 
      }
    },
    {
      sequelize,
      modelName: 'Cart',
      tableName: 'carts',
      underscored: true,
      timestamps: true
    }
  );

  return Cart;
};