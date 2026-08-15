const Order = require('../models/Order');
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const sendEmail = require('../utils/sendEmail');

const addOrderItems = async (req, res) => {
  try {
    const { items, address, paymentId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // 1. Prevent Duplicate Orders (Check paymentId or 10-second debounce per user)
    if (paymentId) {
      const existingPaymentOrder = await Order.findOne({ paymentId });
      if (existingPaymentOrder) {
        return res.status(200).json(existingPaymentOrder);
      }
    }

    const tenSecondsAgo = new Date(Date.now() - 10000);
    const recentDuplicate = await Order.findOne({
      userId: req.user._id,
      createdAt: { $gte: tenSecondsAgo }
    });

    if (recentDuplicate) {
      return res.status(400).json({ message: 'Duplicate order request detected. Please wait a moment.' });
    }

    // 2. Fetch Products & Verify Prices & Stock on Server Side
    let totalAmount = 0;
    const verifiedItems = [];

    for (const item of items) {
      const productId = item.productId || item._id;
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name || productId}` });
      }

      if (product.stock < item.qty) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}. Available: ${product.stock}` });
      }

      totalAmount += product.price * item.qty;
      verifiedItems.push({
        productId: product._id,
        vendorId: product.vendorId,
        name: product.name,
        qty: item.qty,
        price: product.price,
        status: 'Pending'
      });
    }

    // 3. Determine Payment Method & Create Order
    const paymentMethod = (paymentId && paymentId.startsWith('COD_')) ? 'COD' : 'Online';

    const order = new Order({
      userId: req.user._id,
      items: verifiedItems,
      totalAmount,
      address,
      paymentId,
      paymentMethod
    });

    const createdOrder = await order.save();

    // 4. Deduct Product Stock
    for (const item of verifiedItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.qty }
      });
    }

    // 5. Send Order Confirmation Email (Non-blocking catch)
    try {
      const message = `
        <h2>Order Confirmation</h2>
        <p>Hello ${req.user.name},</p>
        <p>Your order has been successfully placed! Order ID: <strong>${createdOrder._id}</strong></p>
        <p>Total Amount: ₹${totalAmount.toFixed(2)} (${paymentMethod})</p>
        <p>Shipping to: ${address.street}, ${address.city}</p>
        <p>Thank you for shopping with ShopNest!</p>
      `;

      await sendEmail({
        email: req.user.email,
        subject: 'ShopNest - Order Confirmation',
        message
      });
    } catch (emailErr) {
      console.error('Email confirmation sending failed:', emailErr.message);
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('userId', 'id name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status || order.status;
      
      // Admin global update applies to all items as well
      order.items.forEach(item => {
        item.status = order.status;
      });

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVendorOrders = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    const orders = await Order.find({ 'items.vendorId': vendor._id }).populate('userId', 'name email');
    
    const vendorOrders = orders.map(order => {
      const vendorItems = order.items.filter(item => String(item.vendorId) === String(vendor._id));
      const orderAmount = vendorItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
      
      return {
        _id: order._id,
        createdAt: order.createdAt,
        user: order.userId,
        address: order.address,
        paymentMethod: order.paymentMethod,
        items: vendorItems,
        totalAmount: orderAmount,
        globalStatus: order.status
      };
    });

    res.json(vendorOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateVendorOrderStatus = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const { status } = req.body;
    
    let updated = false;
    order.items.forEach(item => {
      if (String(item.vendorId) === String(vendor._id)) {
        item.status = status;
        updated = true;
      }
    });

    if (!updated) {
      return res.status(403).json({ message: 'No items in this order belong to you' });
    }
    
    const allDelivered = order.items.every(i => i.status === 'Delivered');
    const allShipped = order.items.every(i => i.status === 'Shipped' || i.status === 'Delivered');
    
    if (allDelivered) order.status = 'Delivered';
    else if (allShipped) order.status = 'Shipped';
    
    await order.save();
    res.json({ message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addOrderItems, getMyOrders, getOrders, updateOrderStatus, getVendorOrders, updateVendorOrderStatus };