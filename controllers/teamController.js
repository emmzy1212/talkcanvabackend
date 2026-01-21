import TeamMember from '../models/TeamMember.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/uploadToCloudinary.js';

export const getTeamMembers = async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ displayOrder: 1 });
    res.json({ success: true, members });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Team member not found' });
    res.json({ success: true, member });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createTeamMember = async (req, res) => {
  try {
    const { name, role, bio, displayOrder } = req.body;

    if (!name || !role) return res.status(400).json({ message: 'Name and role required' });

    let photoUrl = '';
    if (req.file?.buffer) {
      photoUrl = await uploadToCloudinary(req.file.buffer, 'talk-canvas/team');
    }

    const member = new TeamMember({
      name,
      role,
      bio: bio || '',
      photo: photoUrl,
      displayOrder: displayOrder ? Number(displayOrder) : 0,
    });

    await member.save();
    res.status(201).json({ success: true, member });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const updateTeamMember = async (req, res) => {
  try {
    const { name, role, bio, displayOrder } = req.body;
    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Team member not found' });

    if (name) member.name = name;
    if (role) member.role = role;
    if (bio) member.bio = bio;
    if (displayOrder !== undefined) member.displayOrder = Number(displayOrder);

    if (req.file?.buffer) {
      if (member.photo) await deleteFromCloudinary(member.photo);
      member.photo = await uploadToCloudinary(req.file.buffer, 'talk-canvas/team');
    }

    await member.save();
    res.json({ success: true, member });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Team member not found' });

    if (member.photo) await deleteFromCloudinary(member.photo);

    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Team member deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
