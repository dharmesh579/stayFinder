import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

const uploadToCloudinary = async (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "stayfinder_listings",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};

export default uploadToCloudinary;
