const express = require('express');
const { getProducts, getVendorProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { vendor } = require('../middleware/vendorMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.route('/').get(getProducts).post(protect, vendor, upload.single('image'), createProduct);
router.route('/vendor-products').get(protect, vendor, getVendorProducts);
router.route('/:id').get(getProductById).put(protect, vendor, upload.single('image'), updateProduct).delete(protect, vendor, deleteProduct);

module.exports = router;