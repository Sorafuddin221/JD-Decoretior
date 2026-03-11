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
}, { timestamps: true });

export default mongoose.models.PaymentSettings || mongoose.model('PaymentSettings', paymentSettingsSchema);
