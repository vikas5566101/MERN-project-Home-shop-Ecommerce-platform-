const Vendor = require('../models/Vendor');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// User applies to become a vendor
const applyForVendor = async (req, res) => {
  try {
    const { storeName, description, storeLogo } = req.body;

    const existingVendor = await Vendor.findOne({ userId: req.user._id });
    if (existingVendor) {
      return res.status(400).json({ message: 'You have already submitted a vendor application.' });
    }

    const nameExists = await Vendor.findOne({ storeName });
    if (nameExists) {
      return res.status(400).json({ message: 'Store name already taken. Please choose another.' });
    }

    const vendor = new Vendor({
      userId: req.user._id,
      storeName,
      description,
      storeLogo,
      isApproved: false
    });

    const createdVendor = await vendor.save();
    res.status(201).json(createdVendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin gets all pending vendor applications
const getVendorApplications = async (req, res) => {
  try {
    const applications = await Vendor.find({ isApproved: false }).populate('userId', 'name email');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin approves a vendor
const approveVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor application not found' });
    }

    vendor.isApproved = true;
    await vendor.save();

    const user = await User.findById(vendor.userId);
    if (user) {
      user.role = 'vendor';
      await user.save();
    }

    res.json({ message: 'Vendor approved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin rejects/deletes a vendor application
const rejectVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor application not found' });
    }

    await vendor.deleteOne();
    res.json({ message: 'Vendor application rejected' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User gets their own application status
const getVendorStatus = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) {
      return res.json({ status: 'none' });
    }
    if (vendor.isApproved) {
      return res.json({ status: 'approved', storeName: vendor.storeName });
    } else {
      return res.json({ status: 'pending', storeName: vendor.storeName });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin gets all approved vendors
const getAllApprovedVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({ isApproved: true }).populate('userId', 'name email');
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get vendor stats
const getVendorStats = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    // Active Products
    const activeProductsCount = await Product.countDocuments({ vendorId: vendor._id });

    // Orders involving this vendor
    const vendorOrders = await Order.find({ 'items.vendorId': vendor._id });

    let totalRevenue = 0;
    let pendingOrdersCount = 0;
    const uniqueCustomers = new Set();

    vendorOrders.forEach(order => {
      let hasPending = false;
      let vendorItems = order.items.filter(item => item.vendorId.toString() === vendor._id.toString());
      
      vendorItems.forEach(item => {
        totalRevenue += (item.price * item.qty);
        if (item.status === 'Pending') hasPending = true;
      });

      if (hasPending) pendingOrdersCount++;
      uniqueCustomers.add(order.userId.toString());
    });

    res.json({
      revenue: totalRevenue,
      activeProducts: activeProductsCount,
      pendingOrders: pendingOrdersCount,
      totalCustomers: uniqueCustomers.size
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { applyForVendor, getVendorApplications, approveVendor, rejectVendor, getVendorStatus, getAllApprovedVendors, getVendorStats };
