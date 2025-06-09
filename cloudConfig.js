const cloudinary = require('cloudinary').v2;
// npm install cloudinary@1.27.1 multer@1.4.5-lts.1 multer-storage-cloudinary@4.0.0
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'travShort_DEV',
      allowed_formats: ["png","jpg","jpeg","pdf"], 

    },
  });

  module.exports = {
    cloudinary,
    storage,
  }