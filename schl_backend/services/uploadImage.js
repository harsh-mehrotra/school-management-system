import cloudinary from 'cloudinary';
import streamifier from 'streamifier';

const uploadImageToCloudinary = async (buffer, folder) => {
  try {
    return await new Promise((resolve, reject) => {
      let stream = cloudinary.v2.uploader.upload_stream(
        { folder, quality: 'auto:best', width: 260, height: 400 },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      streamifier.createReadStream(buffer).pipe(stream);
    });
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

export default uploadImageToCloudinary;