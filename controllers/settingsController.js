import Settings from '../models/Settings.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/uploadToCloudinary.js';

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { whatsappLink, instagramLink, aboutContent, maintenanceMode, maintenanceTitle } = req.body;
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings();
    }

    if (whatsappLink) settings.whatsappLink = whatsappLink;
    if (instagramLink) settings.instagramLink = instagramLink;
    if (aboutContent) settings.aboutContent = aboutContent;
    if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;
    if (maintenanceTitle) settings.maintenanceTitle = maintenanceTitle;

    await settings.save();
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    if (settings.logo) {
      await deleteFromCloudinary(settings.logo);
    }

    const logoUrl = await uploadToCloudinary(req.file.path, 'talk-canvas/branding');
    settings.logo = logoUrl;
    await settings.save();

    res.json({ success: true, logo: logoUrl, settings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const uploadHeroImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    if (settings.heroImage) {
      await deleteFromCloudinary(settings.heroImage);
    }

    const heroImageUrl = await uploadToCloudinary(req.file.path, 'talk-canvas/branding');
    settings.heroImage = heroImageUrl;
    await settings.save();

    res.json({ success: true, heroImage: heroImageUrl, settings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const uploadMaintenanceImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    if (settings.maintenanceImage) {
      await deleteFromCloudinary(settings.maintenanceImage);
    }

    const maintenanceImageUrl = await uploadToCloudinary(req.file.path, 'talk-canvas/branding');
    settings.maintenanceImage = maintenanceImageUrl;
    await settings.save();

    res.json({ success: true, maintenanceImage: maintenanceImageUrl, settings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
