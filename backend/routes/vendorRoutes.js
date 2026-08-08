const express = require('express');
const { applyForVendor, getVendorApplications, approveVendor, rejectVendor, getVendorStatus, getAllApprovedVendors } = require('../controllers/vendorController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

const router = express.Router();

router.post('/apply', protect, applyForVendor);
router.get('/status', protect, getVendorStatus);
router.get('/applications', protect, admin, getVendorApplications);
router.get('/approved', protect, admin, getAllApprovedVendors);
router.put('/:id/approve', protect, admin, approveVendor);
router.delete('/:id/reject', protect, admin, rejectVendor);

module.exports = router;
