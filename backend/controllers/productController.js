// controllers/productController.js
const productService = require('../services/productService');

// List products with search, filter, pagination
async function listProducts(req, res, next) {
  try {
    const { search, categoryId, limit = 12, offset = 0, sortBy, order } = req.query;

    const result = await productService.getProducts({
      search,
      categoryId,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      sortBy: sortBy || 'created_at',
      order: order || 'DESC'
    });

    // ✅ Use result.products and result.total (not result.rows and result.count)
    res.json({
      products: result.products,  // Changed from result.rows
      total: result.total,         // Changed from result.count
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });
  } catch (error) {
    console.error('List products error:', error);
    next(error);
  }
}

// Get product details by ID
async function getProductDetail(req, res, next) {
  try {
    const productId = req.params.id;

    const product = await productService.getProductById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product detail error:', error);
    next(error);
  }
}

module.exports = {
  listProducts,
  getProductDetail,
};