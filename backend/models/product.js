'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Category, { foreignKey: 'category_id', as: 'Category' });
      Product.hasMany(models.CartItem, { foreignKey: 'product_id', as: 'CartItems' });
      Product.hasMany(models.OrderItem, { foreignKey: 'product_id', as: 'OrderItems' });
    }
  }

  Product.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      stock_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      image_urls: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: []
      },
      specifications: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {}
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Product',
      tableName: 'products',
      underscored: true,
      timestamps: true
    }
  );

  return Product;
};