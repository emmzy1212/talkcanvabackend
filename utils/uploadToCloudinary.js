import { v2 as cloudinary } from 'cloudinary';

/**
 * Ensure Cloudinary is configured ONLY when needed
 */
const ensureCloudinary = () => {
  if (!cloudinary.config().api_key) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    if (!process.env.CLOUDINARY_API_KEY) {
      throw new Error('Cloudinary env variables not loaded');
    }
  }
};

/**
 * Upload file buffer to Cloudinary
 */
export const uploadToCloudinary = (buffer, folder, isVideo = false) => {
  ensureCloudinary();

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: isVideo ? 'video' : 'image',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      )
      .end(buffer);
  });
};

/**
 * Delete file from Cloudinary
 */
export const deleteFromCloudinary = async (url) => {
  ensureCloudinary();

  const publicId = url
    .split('/')
    .slice(-2)
    .join('/')
    .split('.')[0];

  await cloudinary.uploader.destroy(publicId, {
    resource_type: 'image',
  });
};
