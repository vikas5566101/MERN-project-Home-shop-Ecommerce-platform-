const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
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

const parseArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      // ignore JSON parse error, fall back to split
    }
    return val.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
};

const createProduct = async (req, res) => {
  try {
    const {
      name, description, price, category, stock,
      gender, brand, discount, sizes, colors, fabric, fit
    } = req.body;

    let imageUrl = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    const product = new Product({
      name,
      description,
      price: Number(price),
      category,
      stock: Number(stock),
      imageUrl,
      gender,
      brand,
      discount: discount ? Number(discount) : 0,
      sizes: parseArray(sizes),
      colors: parseArray(colors),
      fabric,
      fit
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const {
      name, description, price, category, stock,
      gender, brand, discount, sizes, colors, fabric, fit
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = name !== undefined ? name : product.name;
      product.description = description !== undefined ? description : product.description;
      product.price = price !== undefined ? Number(price) : product.price;
      product.category = category !== undefined ? category : product.category;
      product.stock = stock !== undefined ? Number(stock) : product.stock;
      product.gender = gender !== undefined ? gender : product.gender;
      product.brand = brand !== undefined ? brand : product.brand;
      product.discount = discount !== undefined ? Number(discount) : product.discount;
      if (sizes !== undefined) product.sizes = parseArray(sizes);
      if (colors !== undefined) product.colors = parseArray(colors);
      product.fabric = fabric !== undefined ? fabric : product.fabric;
      product.fit = fit !== undefined ? fit : product.fit;

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
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };