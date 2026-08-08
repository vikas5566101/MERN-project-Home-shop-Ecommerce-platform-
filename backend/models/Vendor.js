const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  storeName: { 
    type: String, 
    required: true, 
    unique: true 
  },
  description: { 
    type: String 
  },
  isApproved: { 
    type: Boolean, 
    default: false 
  },
  storeLogo: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Vendor', vendorSchema);
