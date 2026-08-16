const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
      name: { type: String },
      qty: { type: Number, required: true },
      price: { type: Number, required: true },
      status: { type: String, enum: ['Pending', 'Shipped', 'Delivered'], default: 'Pending' }
    }
  ],
  totalAmount: { type: Number, required: true },
  address: {
    fullName: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  paymentId: { type: String, unique: true, sparse: true },
  paymentMethod: { type: String, enum: ['COD', 'Online'], default: 'COD' },
  status: { type: String, enum: ['Pending', 'Shipped', 'Delivered'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);