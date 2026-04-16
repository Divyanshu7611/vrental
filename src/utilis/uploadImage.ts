import cloudinary from "./cloudinary";

export const uploadImage = async (
  file: File,
  folder: string
): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const bytes = Buffer.from(buffer);

  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (err: Error | null, url?: string) => {
      if (settled) return;
      settled = true;
      if (err) reject(err);
      else if (url) resolve(url);
      else reject(new Error("Upload failed with no error"));
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: process.env.FOLDER_NAME || folder,
      },
      (error, result) => {
        if (error) finish(error);
        else if (result?.secure_url) finish(null, result.secure_url);
        else finish(new Error("Upload failed with no error"));
      }
    );

    uploadStream.on("error", (err: Error) => finish(err));
    uploadStream.end(bytes);
  });
};
