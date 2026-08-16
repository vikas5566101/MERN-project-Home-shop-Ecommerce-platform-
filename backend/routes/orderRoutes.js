const express = require('express');
const { addOrderItems, getMyOrders, getOrders, updateOrderStatus, getVendorOrders, updateVendorOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { vendor } = require('../middleware/vendorMiddleware');

const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/vendor-orders').get(protect, vendor, getVendorOrders);
router.route('/:id/status').put(protect, admin, updateOrderStatus);
router.route('/:id/vendor-status').put(protect, vendor, updateVendorOrderStatus);

module.exports = router;