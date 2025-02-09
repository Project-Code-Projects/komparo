import "dotenv/config.js";
import cloudinary from "cloudinary";

// const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME || "dganhxhid";
// const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "672381925111413";
// const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "KYxtoS3wN2T8eLq0qUP5USr7XQc";

export const config = cloudinary.config({
  cloud_name: "dganhxhid",
  api_key: "672381925111413",
  api_secret: "KYxtoS3wN2T8eLq0qUP5USr7XQc",
});
