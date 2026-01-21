import Post from '../models/Post.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/uploadToCloudinary.js';

// PUBLIC
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ published: true }).sort({ createdAt: -1 });
    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN
export const getAdminPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, description, category, featured } = req.body;
    if (!title || !category) return res.status(400).json({ message: 'Title & category required' });

    const media = [];

    // Upload images
    if (req.files?.image) {
      for (const file of req.files.image) {
        const url = await uploadToCloudinary(file.buffer, 'talk-canvas/posts');
        media.push({ type: 'image', url });
      }
    }

    // Upload videos
    if (req.files?.video) {
      for (const file of req.files.video) {
        const url = await uploadToCloudinary(file.buffer, 'talk-canvas/posts', true);
        media.push({ type: 'video', url });
      }
    }

    const post = await Post.create({
      title,
      description,
      category,
      featured: featured === 'true',
      media,
      published: true,
    });

    res.status(201).json({ success: true, post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const { title, description, category, featured, published } = req.body;

    if (title) post.title = title;
    if (description) post.description = description;
    if (category) post.category = category;
    if (featured !== undefined) post.featured = featured === 'true';
    if (published !== undefined) post.published = published === 'true';

    // Update images
    if (req.files?.image) {
      for (const m of post.media.filter(m => m.type === 'image')) {
        await deleteFromCloudinary(m.url);
      }
      post.media = post.media.filter(m => m.type !== 'image');

      for (const file of req.files.image) {
        const url = await uploadToCloudinary(file.buffer, 'talk-canvas/posts');
        post.media.push({ type: 'image', url });
      }
    }

    // Update videos
    if (req.files?.video) {
      for (const m of post.media.filter(m => m.type === 'video')) {
        await deleteFromCloudinary(m.url);
      }
      post.media = post.media.filter(m => m.type !== 'video');

      for (const file of req.files.video) {
        const url = await uploadToCloudinary(file.buffer, 'talk-canvas/posts', true);
        post.media.push({ type: 'video', url });
      }
    }

    await post.save();
    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    for (const m of post.media) await deleteFromCloudinary(m.url);

    await post.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
