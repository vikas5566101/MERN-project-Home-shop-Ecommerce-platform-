const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const cloudinary = require('../config/cloudinary');

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate('vendorId', 'storeName');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVendorProducts = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor profile not found' });
    }
    const products = await Product.find({ vendorId: vendor._id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    let vendorId = req.body.vendorId;
    const vendor = await Vendor.findOne({ userId: req.user._id });
    
    if (req.user.role === 'vendor' || !vendorId) {
      if (!vendor) {
        return res.status(400).json({ message: 'You must have an approved Vendor profile to create products.' });
      }
      vendorId = vendor._id;
    }

    const { name, description, price, category, stock } = req.body;
    let imageUrl = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }
    const product = new Product({
      name, description, price, category, stock, imageUrl, vendorId
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      if (req.user.role !== 'admin') {
        const vendor = await Vendor.findOne({ userId: req.user._id });
        if (!vendor || String(product.vendorId) !== String(vendor._id)) {
          return res.status(403).json({ message: 'Not authorized to edit this product.' });
        }
      }

      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.category = category || product.category;
      product.stock = stock || product.stock;

      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        product.imageUrl = result.secure_url;
      }
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      if (req.user.role !== 'admin') {
        const vendor = await Vendor.findOne({ userId: req.user._id });
        if (!vendor || String(product.vendorId) !== String(vendor._id)) {
          return res.status(403).json({ message: 'Not authorized to delete this product.' });
        }
      }

      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getVendorProducts, getProductById, createProduct, updateProduct, deleteProduct };