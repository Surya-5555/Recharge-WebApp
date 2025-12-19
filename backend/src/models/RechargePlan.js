const mongoose = require('mongoose');

const rechargePlanSchema = new mongoose.Schema({
  operator: {
    type: String,
    required: true,
    enum: ['Airtel', 'Jio', 'Vi', 'BSNL']
  },
  planType: {
    type: String,
    required: true,
    enum: ['Prepaid', 'Postpaid', 'DTH']
  },
  amount: {
    type: Number,
    required: true
  },
  validity: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  benefits: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('RechargePlan', rechargePlanSchema);