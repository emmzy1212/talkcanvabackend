import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    logo: {
      type: String,
      default: '',
    },
    heroImage: {
      type: String,
      default: '',
    },
    whatsappLink: {
      type: String,
      default: '',
    },
    instagramLink: {
      type: String,
      default: '',
    },
    aboutContent: {
      type: String,
      default: '',
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    maintenanceImage: {
      type: String,
      default: '',
    },
    maintenanceTitle: {
      type: String,
      default: 'Coming Soon',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Settings', settingsSchema);
