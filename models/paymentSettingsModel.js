import mongoose from 'mongoose';

const paymentSettingsSchema = new mongoose.Schema({
  taxPercentage: {
    type: Number,
    default: 0,
  },
  shippingZones: [
    {
      name: { type: String, required: true },
      cost: { type: Number, required: true }
    }
  ],
  activeDivisions: {
    type: [String],
    default: ["Rajshahi"]
  },
  activeDistricts: {
    type: [String],
    default: ["Naogaon"]
  },
  freeShippingThreshold: {
    type: Number,
    default: 10000,
  },
  bkashNumber: {
    type: String,
    default: "01XXXXXXXXX"
  },
  bkashInstructions: {
    type: String,
    default: "Please Send Money to this number and provide TrxID below."
  },
  rocketNumber: {
    type: String,
    default: "01XXXXXXXXXX"
  },
  rocketInstructions: {
    type: String,
    default: "Please Send Money to this number and provide TrxID below."
  },
  nagadNumber: {
    type: String,
    default: "01XXXXXXXXX"
  },
  nagadInstructions: {
    type: String,
    default: "Please Send Money to this number and provide TrxID below."
  },
  securityDepositPercentage: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.models.PaymentSettings || mongoose.model('PaymentSettings', paymentSettingsSchema);
