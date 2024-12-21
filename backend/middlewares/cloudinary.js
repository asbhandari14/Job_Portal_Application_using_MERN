import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"
import dotenv from "dotenv";
dotenv.config();




 // Configuration
 cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});


// Function to Upload File in the Cloudinary to generate the URL 
const uploadImageOnCloudinary=async(filePath, folderName)=>{
    try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {folder: folderName});
    if(uploadResult.public_id){
        fs.unlinkSync(filePath);
    }
    else{
        console.log("Error while uploading image on the cloudinary");
    }

    const {secure_url, public_id} = uploadResult
    return {secure_url, public_id}
    } catch (error) {
        console.log("Cloudinary error", error);
    }
}


export default uploadImageOnCloudinary;
