import { v2 as cloudinary } from "cloudinary";
import logger from "../utils/logger.js";

export const initCloudinary = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    logger.info("Cloudinary configured successfully");
    return cloudinary;
  } catch (error) {
    logger.error("Cloudinary configuration error:", error);
    throw error;
  }
};

export const uploadToCloudinary = async (file, folder = "dineflow") => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    const result = await cloudinary.uploader.upload(file.path || file, {
      folder,
      resource_type: "auto",
      quality: "auto",
      fetch_format: "auto",
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      size: result.bytes,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    logger.error("Cloudinary upload error:", error);
    throw error;
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    logger.info(`Deleted image ${publicId} from Cloudinary`);
  } catch (error) {
    logger.error(`Error deleting image ${publicId} from Cloudinary:`, error);
    throw error;
  }
};
