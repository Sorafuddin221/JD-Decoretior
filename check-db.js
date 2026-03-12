import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const settingsSchema = new mongoose.Schema({
  siteTitle: String,
  siteLogoUrl: String,
  siteFaviconUrl: String,
  textIcon: String,
  phoneNumber: String,
  contactEmail: String,
}, { timestamps: true });

const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);

async function checkDuplicates() {
  try {
    if (!process.env.DB_URI) {
        console.error("DB_URI is not defined in .env");
        process.exit(1);
    }
    await mongoose.connect(process.env.DB_URI);
    const settings = await Settings.find({});
    console.log(`Found ${settings.length} settings documents.`);
    settings.forEach((s, index) => {
      console.log(`[${index}] ID: ${s._id}, Title: ${s.siteTitle}, Phone: ${s.phoneNumber}, Email: ${s.contactEmail}`);
    });

    if (settings.length > 1) {
        console.log("MULTIPLE SETTINGS DETECTED!");
    } else if (settings.length === 0) {
        console.log("NO SETTINGS FOUND.");
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

checkDuplicates();
