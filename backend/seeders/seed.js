const { sequelize, Category, Product, User } = require('../models');
const bcrypt = require('bcryptjs');

const categories = [
    { name: 'Electronics' },
    { name: 'Books' },
    { name: 'Clothing' },
    { name: 'Home & Kitchen' },
    { name: 'Toys & Games' },
];

const getProducts = (categoryMap) => [
    { name: 'Wireless Headphones', price: 1999, stock_quantity: 50, category_id: categoryMap['Electronics'], image_urls: JSON.stringify(['https://picsum.photos/seed/p1/400/400']), description: 'Premium wireless headphones with noise cancellation' },
    { name: 'Bluetooth Speaker', price: 1499, stock_quantity: 40, category_id: categoryMap['Electronics'], image_urls: JSON.stringify(['https://picsum.photos/seed/p2/400/400']), description: 'Portable waterproof bluetooth speaker' },
    { name: 'Smartphone Stand', price: 399, stock_quantity: 100, category_id: categoryMap['Electronics'], image_urls: JSON.stringify(['https://picsum.photos/seed/p3/400/400']), description: 'Adjustable phone stand for desk' },
    { name: 'USB-C Hub', price: 1299, stock_quantity: 60, category_id: categoryMap['Electronics'], image_urls: JSON.stringify(['https://picsum.photos/seed/p4/400/400']), description: '7-in-1 USB-C hub with HDMI' },
    { name: 'Mechanical Keyboard', price: 3499, stock_quantity: 30, category_id: categoryMap['Electronics'], image_urls: JSON.stringify(['https://picsum.photos/seed/p5/400/400']), description: 'RGB mechanical gaming keyboard' },
    { name: 'Webcam HD', price: 2499, stock_quantity: 25, category_id: categoryMap['Electronics'], image_urls: JSON.stringify(['https://picsum.photos/seed/p6/400/400']), description: '1080p HD webcam with mic' },
    { name: 'Mouse Wireless', price: 799, stock_quantity: 80, category_id: categoryMap['Electronics'], image_urls: JSON.stringify(['https://picsum.photos/seed/p7/400/400']), description: 'Ergonomic wireless mouse' },
    { name: 'Monitor Light Bar', price: 1899, stock_quantity: 35, category_id: categoryMap['Electronics'], image_urls: JSON.stringify(['https://picsum.photos/seed/p8/400/400']), description: 'LED monitor light bar' },

    { name: 'The Alchemist', price: 299, stock_quantity: 100, category_id: categoryMap['Books'], image_urls: JSON.stringify(['https://picsum.photos/seed/p9/400/400']), description: 'Bestselling novel by Paulo Coelho' },
    { name: 'Atomic Habits', price: 399, stock_quantity: 90, category_id: categoryMap['Books'], image_urls: JSON.stringify(['https://picsum.photos/seed/p10/400/400']), description: 'Build good habits by James Clear' },
    { name: 'Rich Dad Poor Dad', price: 349, stock_quantity: 85, category_id: categoryMap['Books'], image_urls: JSON.stringify(['https://picsum.photos/seed/p11/400/400']), description: 'Personal finance classic' },
    { name: 'Deep Work', price: 449, stock_quantity: 70, category_id: categoryMap['Books'], image_urls: JSON.stringify(['https://picsum.photos/seed/p12/400/400']), description: 'Focus for success by Cal Newport' },

    { name: 'Cotton T-Shirt', price: 499, stock_quantity: 200, category_id: categoryMap['Clothing'], image_urls: JSON.stringify(['https://picsum.photos/seed/p13/400/400']), description: 'Premium cotton round neck t-shirt' },
    { name: 'Denim Jeans', price: 1299, stock_quantity: 150, category_id: categoryMap['Clothing'], image_urls: JSON.stringify(['https://picsum.photos/seed/p14/400/400']), description: 'Slim fit denim jeans' },
    { name: 'Casual Hoodie', price: 999, stock_quantity: 120, category_id: categoryMap['Clothing'], image_urls: JSON.stringify(['https://picsum.photos/seed/p15/400/400']), description: 'Comfortable fleece hoodie' },
    { name: 'Running Shoes', price: 2499, stock_quantity: 60, category_id: categoryMap['Clothing'], image_urls: JSON.stringify(['https://picsum.photos/seed/p16/400/400']), description: 'Lightweight running shoes' },

    { name: 'Air Fryer', price: 3999, stock_quantity: 40, category_id: categoryMap['Home & Kitchen'], image_urls: JSON.stringify(['https://picsum.photos/seed/p17/400/400']), description: '4L digital air fryer' },
    { name: 'Coffee Maker', price: 2999, stock_quantity: 35, category_id: categoryMap['Home & Kitchen'], image_urls: JSON.stringify(['https://picsum.photos/seed/p18/400/400']), description: 'Drip coffee maker 12 cups' },
    { name: 'Non-Stick Pan', price: 899, stock_quantity: 90, category_id: categoryMap['Home & Kitchen'], image_urls: JSON.stringify(['https://picsum.photos/seed/p19/400/400']), description: '28cm non-stick frying pan' },
    { name: 'Water Bottle', price: 599, stock_quantity: 150, category_id: categoryMap['Home & Kitchen'], image_urls: JSON.stringify(['https://picsum.photos/seed/p20/400/400']), description: 'Stainless steel insulated bottle' },

    { name: 'LEGO Classic Set', price: 1999, stock_quantity: 45, category_id: categoryMap['Toys & Games'], image_urls: JSON.stringify(['https://picsum.photos/seed/p21/400/400']), description: 'Creative LEGO building set' },
    { name: 'Chess Board', price: 799, stock_quantity: 60, category_id: categoryMap['Toys & Games'], image_urls: JSON.stringify(['https://picsum.photos/seed/p22/400/400']), description: 'Wooden chess board with pieces' },
    { name: 'Rubiks Cube', price: 299, stock_quantity: 100, category_id: categoryMap['Toys & Games'], image_urls: JSON.stringify(['https://picsum.photos/seed/p23/400/400']), description: 'Original 3x3 Rubiks cube' },
    { name: 'Uno Card Game', price: 399, stock_quantity: 80, category_id: categoryMap['Toys & Games'], image_urls: JSON.stringify(['https://picsum.photos/seed/p24/400/400']), description: 'Classic Uno card game' },
];

async function seed() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to database');

        await sequelize.sync({ alter: true });
        console.log('✅ Tables synced');

        // Seed categories
        const createdCategories = await Promise.all(
            categories.map(cat => Category.findOrCreate({ where: { name: cat.name }, defaults: cat }))
        );

        const categoryMap = {};
        createdCategories.forEach(([cat]) => { categoryMap[cat.name] = cat.id; });
        console.log('✅ Categories seeded');

        // Seed products
        const products = getProducts(categoryMap);
        for (const product of products) {
            await Product.findOrCreate({
                where: { name: product.name },
                defaults: product
            });
        }
        console.log(`✅ ${products.length} products seeded`);

        console.log('🎉 Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    }
}

seed();