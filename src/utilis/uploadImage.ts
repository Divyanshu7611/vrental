import cloudinary from "./cloudinary";

export const uploadImage = async (
  file: File,
  folder: string
): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const bytes = Buffer.from(buffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: process.env.FOLDER_NAME || folder,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error("Upload failed with no error"));
        }
      }
    );

    uploadStream.end(bytes);
  });
};
