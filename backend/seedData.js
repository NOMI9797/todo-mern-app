require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

// Sample product data
const products = [
    {
        name: 'Wireless Headphones',
        description: 'Premium noise-cancelling wireless headphones with long battery life.',
        price: 199.99,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format',
        category: 'Electronics',
        stock: 25
    },
    {
        name: 'Smartphone',
        description: 'Latest model smartphone with high-resolution camera and fast processor.',
        price: 699.99,
        imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format',
        category: 'Electronics',
        stock: 15
    },
    {
        name: 'Laptop',
        description: 'Powerful laptop for work and gaming with dedicated graphics card.',
        price: 1299.99,
        imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format',
        category: 'Electronics',
        stock: 10
    },
    {
        name: 'Running Shoes',
        description: 'Lightweight and comfortable running shoes for all types of terrain.',
        price: 89.99,
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format',
        category: 'Fashion',
        stock: 30
    },
    {
        name: 'T-Shirt',
        description: 'Comfortable cotton t-shirt available in various colors.',
        price: 24.99,
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format',
        category: 'Fashion',
        stock: 50
    },
    {
        name: 'Backpack',
        description: 'Durable backpack with multiple compartments for everyday use.',
        price: 59.99,
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format',
        category: 'Fashion',
        stock: 20
    },
    {
        name: 'Coffee Maker',
        description: 'Programmable coffee maker with thermal carafe to keep coffee hot.',
        price: 79.99,
        imageUrl: 'https://images.unsplash.com/photo-1570942872213-1242607a35f2?w=500&auto=format',
        category: 'Home',
        stock: 15
    },
    {
        name: 'Blender',
        description: 'High-powered blender for smoothies, soups, and more.',
        price: 149.99,
        imageUrl: 'https://images.unsplash.com/photo-1620811936792-aee5a478434d?w=500&auto=format',
        category: 'Home',
        stock: 12
    },
    {
        name: 'Desk Lamp',
        description: 'Adjustable desk lamp with different brightness levels and color temperatures.',
        price: 39.99,
        imageUrl: 'https://images.unsplash.com/photo-1572636591014-7e91b1e942b4?w=500&auto=format',
        category: 'Home',
        stock: 40
    },
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('MongoDB Connected');
    
    try {
        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');
        
        // Insert new products
        const insertedProducts = await Product.insertMany(products);
        console.log(`Seeded ${insertedProducts.length} products`);
        
        mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error seeding data:', error);
        mongoose.connection.close();
    }
})
.catch(err => {
    console.error('MongoDB connection error:', err);
}); 