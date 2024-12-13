import { v2 as cloudinary } from 'cloudinary';
import packageData from "../package.json";
import dataUriToBuffer from "lib/data-uri-to-buffer";

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function uploadFile(sigilDataURI) {
  const uploadResult = await cloudinary.uploader.upload(sigilDataURI, {
    folder: `uploads/${packageData.name}/${packageData.version}`,
    public_id: `sigil_input_${Date.now()}`,
    resource_type: 'image',
    metadata: {
      user_agent: navigator.userAgent
    }
  });

  return uploadResult.secure_url;
}
