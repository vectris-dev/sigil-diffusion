import { v2 as cloudinary } from "cloudinary";
import packageData from "../../package.json";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { sigilDataURI } = req.body;
    const uploadResult = await cloudinary.uploader.upload(sigilDataURI, {
      folder: `uploads/${packageData.name}/${packageData.version}`,
      public_id: `sigil_input_${Date.now()}`,
      resource_type: "image",
    });

    res.status(200).json({ url: uploadResult.secure_url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
