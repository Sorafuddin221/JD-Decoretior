import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  siteTitle: {
    type: String,
    required: true,
  },
  siteLogoUrl: {
    type: String,
  },
  siteFaviconUrl: {
    type: String,
  },
  textIcon: {
    type: String,
  },
  phoneNumber: {
    type: String,
    default: "01516143874",
  },
  contactEmail: {
    type: String,
    default: "yamartbd@gmail.com",
  },
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
