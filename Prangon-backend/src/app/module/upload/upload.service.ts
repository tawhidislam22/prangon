import { deleteFileFromCloudinary, uploadFileToCloudinary } from "../../config/cloudinary.config";

const uploadFile = async (buffer: Buffer, fileName: string) => {
    const result = await uploadFileToCloudinary(buffer, fileName);
    return result;
};

const deleteFile = async (url: string) => {
    await deleteFileFromCloudinary(url);
    return null;
};

export const UploadService = {
    uploadFile,
    deleteFile
};
