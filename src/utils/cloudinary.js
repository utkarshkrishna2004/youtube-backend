import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// The Node.js file system(fs) module allows you to work with the file system on your computer. eg, read, create, update, delete files.

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // now, upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        //now, when file has been uploaded successfully
        console.log(
            "File has successfully been uploaded on cloudinary..!",
            response.url
        );

        return response;
        
    } catch (error) {
        fs.unlinkSync(localFilePath); //we did it to remove the locally saved temproary file on our server as the upload operation got failed.
        return null;
    }
};

export { uploadOnCloudinary };
