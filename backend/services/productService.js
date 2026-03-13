// services/productService.js
const { Product, Category } = require('../models');
const { Op } = require('sequelize');

async function getProducts({ search = '', categoryId = null, limit = 12, offset = 0, sortBy = 'created_at', order = 'DESC' }) {
  try {
    const whereClause = {};

    // Search by product name or description if provided
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Filter by category if provided
    if (categoryId) {
      whereClause.category_id = categoryId;
    }

    // Fetch products with pagination, optional search, and filtering
    const { count, rows } = await Product.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, order.toUpperCase()]],
      include: {
        model: Category,
        as: 'Category',
        attributes: ['id', 'name'], // Include category id and name
      },
    });

    return {
      products: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: Math.floor(offset / limit) + 1,
      limit: parseInt(limit),
      offset: parseInt(offset)
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
}

async function getProductById(productId) {
  try {
    const product = await Product.findByPk(productId, {
      include: {
        model: Category,
        as: 'Category',
        attributes: ['id', 'name'],
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

async function createProduct(productData) {
  try {
    const { name, description, price, stock_quantity, image_urls, specifications, category_id } = productData;

    // Validate required fields
    if (!name || !price || !category_id) {
      throw new Error('Name, price, and category are required');
    }

    // Check if category exists
    const category = await Category.findByPk(category_id);
    if (!category) {
      throw new Error('Category not found');
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock_quantity: stock_quantity || 0,
      image_urls: image_urls || [],
      specifications: specifications || {},
      category_id
    });

    return await Product.findByPk(product.id, {
      include: {
        model: Category,
        as: 'Category',
        attributes: ['id', 'name'],
      },
    });
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

async function updateProduct(productId, productData) {
  try {
    const product = await Product.findByPk(productId);
    
    if (!product) {
      throw new Error('Product not found');
    }

    // If category_id is being updated, verify it exists
    if (productData.category_id) {
      const category = await Category.findByPk(productData.category_id);
      if (!category) {
        throw new Error('Category not found');
      }
    }

    await product.update(productData);

    return await Product.findByPk(productId, {
      include: {
        model: Category,
        as: 'Category',
        attributes: ['id', 'name'],
      },
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

async function deleteProduct(productId) {
  try {
    const product = await Product.findByPk(productId);
    
    if (!product) {
      throw new Error('Product not found');
    }

    await product.destroy();
    return { message: 'Product deleted successfully' };
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

async function getProductsByCategory(categoryId, { limit = 12, offset = 0 } = {}) {
  try {
    const category = await Category.findByPk(categoryId);
    
    if (!category) {
      throw new Error('Category not found');
    }

    const { count, rows } = await Product.findAndCountAll({
      where: { category_id: categoryId },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
      include: {
        model: Category,
        as: 'Category',
        attributes: ['id', 'name'],
      },
    });

    return {
      products: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: Math.floor(offset / limit) + 1,
      category: category.name
    };
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
}

async function getFeaturedProducts(limit = 8) {
  try {
    const products = await Product.findAll({
      limit: parseInt(limit),
      order: [['created_at', 'DESC']], // You can change this to order by popularity, sales, etc.
      include: {
        model: Category,
        as: 'Category',
        attributes: ['id', 'name'],
      },
    });

    return products;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getFeaturedProducts
};