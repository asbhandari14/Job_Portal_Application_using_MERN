import { User } from "../models/userSchema.js";
// import { sendToken } from "../utils/jwtToken.js";
import uploadImageOnCloudinary from "../middlewares/cloudinary.js";
import { v2 as cloudinary } from 'cloudinary'





export const RegisterUser = async (req, res) => {
  try {
    const { name, email, phone, address, password, role, categoryFirst, categorySecond, categoryThird, coverLetter } = req.body;

    if(!role){
      return res.status(401).json({success: false, mssg : "Role is not defined"})
    }

    if (!name || !email || !phone || !address || !password || !role) {
      return res.status(401).json({ success: false, mssg: "All Fields are required to filled" });
    }

    if (role === "Job Seeker" && (!categoryFirst || !categorySecond || !categoryThird)) {
      return res.status(400).json({ success: false, mssg: "Please fill all Job Category field" })
    }

    const userExisted = await User.findOne({ email });

    if (userExisted) {
      return res.status(400).json({ success: false, mssg: "User already existed" });
    }

    const userData = { name, email, phone, address, password, role, category: { categoryFirst, categorySecond, categoryThird }, coverLetter };

    if (req.file?.filename) {
      const { secure_url, public_id } = await uploadImageOnCloudinary(req.file.path, "Resume");

      userData.resume = {
        public_id: public_id,
        url: secure_url,
      };
    }

    const user = await User.create(userData);

    if(!user){
      return res.status(401).json({success: false, mssg : "Server Error"});
    }
    return res.status(201).json({ success: true, mssg: "User Registered Successfully", user});
  }
  catch (error) {
    console.log(error);
  }
}



export const LoginUser = async (req, res) => {
  const { role, email, password } = req.body;

  if (!role || !email || !password) {
    return res.status(400).json({ success: false, mssg: "Email, Password and Role all field are required to be filled" });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(400).json({ success: false, mssg: "Invalid email or password" });
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return res.status(400).json({ success: false, mssg: "Invalid email or password" });
  }

  if (user.role !== role) {
    return res.status(400).json({ success: false, mssg: "Invalid user role" });
  }

  const token = await user.getJWTToken();
  return res.status(200).cookie("token", token, { expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000), httpOnly: true }).json({ success: true, mssg: "User Logged in Successfully", token: token, user });
};



export const LogoutUser = async (req, res) => {
  return res.status(200).cookie("token", "", { expires: new Date(Date.now()), httpOnly: true }).json({ success: true, mssg: "Logged out successfully" });
};



export const GetUser = async (req, res) => {
  const user = req.user;
  if (user) {
    return res.status(200).json({ success: true, user });
  }
};



export const UpdateUserProfile = async (req, res) => {

  const { name, email, phone, address, coverLetter, categoryFirst, categorySecond, categoryThird } = req.body;

  const newUserData = {
    name: name,
    email: email,
    phone: phone,
    address: address,
    coverLetter: coverLetter,
    category: {
      categoryFirst: categoryFirst,
      categorySecond: categorySecond,
      categoryThird: categoryThird,
    },
  };



  if (req.user.role === "Job Seeker" && (!categoryFirst || !categorySecond || !categoryThird)) {
    return res.status(400).json({ success: false, mssg: "Please provide your all 3 job category" })
  }

  if (req.file?.filename) {

    const currentResumeId = req.user.resume.public_id;

    if (currentResumeId) {
      await cloudinary.uploader.destroy(currentResumeId);
    }

    const { secure_url, public_id } = await uploadImageOnCloudinary(req.file.path, "Resume");

    newUserData.resume = {
      public_id: public_id,
      url: secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, { new: true });
  return res.status(200).json({ success: true, user, mssg: "Profile updated successfully" });
}







export const UpdateUserPassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if(!oldPassword || !newPassword || !confirmPassword){
    return res.status(401).json({success : false, mssg : "Enter all field"})
  }
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(oldPassword);

  if (!isPasswordMatched) {
    return res.status(401).json({ success: false, mssg: "Old password is incorrect" })
  }

  if (newPassword !== confirmPassword) {
    return res.status(401).json({ success: false, mssg: " New password & confirm password do not match " })
  }

  user.password = newPassword;
  await user.save();
  return res.status(200).json({ success: true, mssg: "Password updated successfully", user })
}
