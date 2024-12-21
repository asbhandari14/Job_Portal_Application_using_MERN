import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";




const isAuthenticated = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(400).json({success : false, mssg : "User is not authenticated or Login"})
        }

        const decoded_token = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decoded_token.id).select({password : 0});

        next();
    } catch (error) {
        console.log(error);
    }
};


export default isAuthenticated