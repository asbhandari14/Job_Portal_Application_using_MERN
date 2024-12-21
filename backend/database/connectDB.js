import mongoose from "mongoose";



const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Backend Server is successfully connected to the MongoDB Database")
    } catch (error) {
        console.log(`Some error occured while connecting to database: ${error}`);
        process.exit(1);
    }
}


export default connectDB