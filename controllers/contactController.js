import Contact from '../models/Contact.js';
import { sendTelegramMessage } from '../utils/telegram.js';

export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const contact = new Contact({
      name,
      email,
      phone: phone || '',
      message,
    });

    await contact.save();

    // Send Telegram notification
    const telegramMessage = `
📧 <b>New Contact Message</b>
👤 <b>Name:</b> ${name}
📧 <b>Email:</b> ${email}
📞 <b>Phone:</b> ${phone || 'Not provided'}
💬 <b>Message:</b> ${message}
    `;

    await sendTelegramMessage(telegramMessage);

    // Emit socket event to notify admin in real-time
    if (global.io) {
      global.io.emit('newContact', contact);
    }

    res.status(201).json({
      success: true,
      message: 'Message received. We will get back to you soon!',
      contact,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, contacts });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const markContactAsRead = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ success: true, message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
