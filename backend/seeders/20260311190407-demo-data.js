'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface) {
    const categories = ['Electronics', 'Books', 'Clothing', 'Home & Kitchen', 'Toys & Games'];

    // Avoid duplicates
    const existing = await queryInterface.sequelize.query(
      `SELECT name FROM categories WHERE name IN ('${categories.join("','")}');`
    );
    const existingNames = existing[0].map(c => c.name);

    const newCategories = categories
      .filter(name => !existingNames.includes(name))
      .map(name => ({ name, created_at: new Date(), updated_at: new Date() }));

    if (newCategories.length > 0) {
      await queryInterface.bulkInsert('categories', newCategories);
    }

    const allCategories = await queryInterface.sequelize.query(
      `SELECT id, name FROM categories WHERE name IN ('${categories.join("','")}');`
    );

    const categoryMap = {};
    allCategories[0].forEach(c => categoryMap[c.name] = c.id);

    const products = [];

    categories.forEach(category => {
      for (let i = 0; i < 10; i++) {
        products.push({
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: faker.commerce.price(10, 1000, 2),
          stock_quantity: faker.number.int({ min: 10, max: 200 }),
          category_id: categoryMap[category],
          image_urls: JSON.stringify([
            `https://picsum.photos/seed/${category.toLowerCase().replace(/ & /g, '-')}-${i}-1/400/400`,
            `https://picsum.photos/seed/${category.toLowerCase().replace(/ & /g, '-')}-${i}-2/400/400`
          ]),
          specifications: JSON.stringify({ info: faker.commerce.productAdjective() }),
          created_at: new Date(),
          updated_at: new Date()
        });
      }
    });

    await queryInterface.bulkInsert('products', products);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('products', null, {});
    await queryInterface.bulkDelete('categories', null, {});
  }
};