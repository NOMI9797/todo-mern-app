// Load environment variables
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 50010;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Connect to MongoDB using environment variable
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Import models
const Product = require('./models/Product');
const Cart = require('./models/Cart');

// PRODUCT ROUTES
// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add new product
app.post('/api/products', async (req, res) => {
    try {
        const { name, description, price, imageUrl, category, stock } = req.body;
        const newProduct = new Product({
            name,
            description,
            price,
            imageUrl,
            category,
            stock
        });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update product
app.put('/api/products/:id', async (req, res) => {
    try {
        const { name, description, price, imageUrl, category, stock } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, description, price, imageUrl, category, stock },
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(deletedProduct);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CART ROUTES
// Get user cart
app.get('/api/cart/:userId', async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
        if (!cart) {
            cart = new Cart({ userId: req.params.userId, items: [] });
            await cart.save();
        }
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add item to cart
app.post('/api/cart', async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        let cart = await Cart.findOne({ userId });
        
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }
        
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }
        
        const updatedCart = await cart.save();
        const populatedCart = await Cart.findById(updatedCart._id).populate('items.productId');
        res.status(201).json(populatedCart);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update cart item quantity
app.put('/api/cart/:userId/:productId', async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await Cart.findOne({ userId: req.params.userId });
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === req.params.productId);
        
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }
        
        cart.items[itemIndex].quantity = quantity;
        
        const updatedCart = await cart.save();
        const populatedCart = await Cart.findById(updatedCart._id).populate('items.productId');
        res.json(populatedCart);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Remove item from cart
app.delete('/api/cart/:userId/:productId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        
        cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
        
        const updatedCart = await cart.save();
        const populatedCart = await Cart.findById(updatedCart._id).populate('items.productId');
        res.json(populatedCart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
