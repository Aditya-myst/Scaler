'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Wishlist extends Model {
        static associate(models) {
            Wishlist.belongsTo(models.User, { foreignKey: 'user_id', as: 'User' });
            Wishlist.belongsTo(models.Product, { foreignKey: 'product_id', as: 'Product' });
        }
    }

    Wishlist.init({
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        product_id: { type: DataTypes.INTEGER, allowNull: false }
    }, {
        sequelize,
        modelName: 'Wishlist',
        tableName: 'wishlists',
        underscored: true,
        timestamps: true
    });

    return Wishlist;
};