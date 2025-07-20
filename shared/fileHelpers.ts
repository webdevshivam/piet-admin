
import { Request } from "express";
import cloudinary from "../server/config/cloudinary";

// Upload file to Cloudinary
export async function uploadFile(req: Request, folder: string): Promise<string | null> {
  if (!req.file) return null;

  // Check if Cloudinary is properly configured
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ Cloudinary credentials missing. Please check your .env file.');
    throw new Error('Cloudinary credentials not configured');
  }

  try {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('✅ File uploaded to Cloudinary:', result?.secure_url);
            resolve(result?.secure_url || null);
          }
        }
      ).end(req.file.buffer);
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    throw error;
  }
}

// Delete a file from Cloudinary
export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    // Extract public_id from Cloudinary URL
    const urlParts = fileUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    const publicId = filename.split('.')[0];
    
    // Find the folder from URL
    const folderIndex = urlParts.findIndex(part => part === 'image' || part === 'video' || part === 'raw');
    let fullPublicId = publicId;
    
    if (folderIndex !== -1 && folderIndex < urlParts.length - 1) {
      const folderParts = urlParts.slice(folderIndex + 1, -1);
      if (folderParts.length > 0) {
        fullPublicId = folderParts.join('/') + '/' + publicId;
      }
    }

    await cloudinary.uploader.destroy(fullPublicId);
    console.log("✅ File deleted from Cloudinary:", fullPublicId);
  } catch (error) {
    console.warn("⚠️ Error deleting file from Cloudinary:", error);
  }
}
