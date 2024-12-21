import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updatePasswordRequest, updatePasswordSuccess, updatePasswordFailed } from "../store/slices/updateProfileSlice";
import { FaRegEyeSlash, FaEye } from "react-icons/fa";
import { LuLoader2 } from "react-icons/lu";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

const UpdatePassword = ({url}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [updatePasswordInput, setUpdatePasswordInput] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  
  const { loading, error, isUpdated } = useSelector((state) => state.updateProfile);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleInputChange=(e)=>{
    let {name, value} = e.target;
    setUpdatePasswordInput({...updatePasswordInput, [name] : value})
  }

  const handleUpdatePassword =async(e) => {
    try {
      e.preventDefault()
      dispatch(updatePasswordRequest());
      const response = await axios.put(`${url}/user/update/password`, updatePasswordInput, {withCredentials: true, headers : {"Content-Type" : "application/json"}});

      if(response.data.success){
        const notify=()=>{toast.success(response?.data?.mssg)};
        notify();
        dispatch(updatePasswordSuccess());
        navigate("/")
      }
    } catch (error) {
      dispatch(updatePasswordFailed());
      console.log(error);
      const notify=()=>{toast.error(error?.response?.data?.mssg)};
      notify();
    }
  };

  return (
    <form className="account_components update_password_component w-full h-auto flex flex-col justify-start items-start my-3">
      <h3 className="text-xl font-bold">Update Password</h3>
      <div className="w-full h-full flex flex-col justify-start items-start my-4">
        <label>Current Password</label>
        <div className="w-full h-full flex justify-between items-center bg-gray-300 rounded-md pr-6">
          <input type={showPassword ? "text" : "password"} name="oldPassword" value={updatePasswordInput.oldPassword} onChange={handleInputChange} className="w-full p-2 outline-none bg-gray-300 rounded-md" placeholder="Enter your current password" autoComplete="off" />
          {showPassword ? (<FaRegEyeSlash className="eye_icon" onClick={() => setShowPassword(!showPassword)} />) : (<FaEye className="eye_icon cursor-pointer" onClick={() => setShowPassword(!showPassword)} />)}
        </div>
      </div>
      <div className="w-full h-full flex flex-col justify-start items-start">
        <label>New Password</label>
        <div className="w-full h-full flex justify-between items-center rounded-md pr-6 bg-gray-300">
          <input type={showPassword ? "text" : "password"} name="newPassword" value={updatePasswordInput.newPassword} onChange={handleInputChange} className="w-full p-2 outline-none bg-gray-300 rounded-md" placeholder="Enter your new password" autoComplete="off" />
          {showPassword ? (<FaRegEyeSlash className="eye_icon" onClick={() => setShowPassword(!showPassword)} />) : (<FaEye className="eye_icon cursor-pointer" onClick={() => setShowPassword(!showPassword)} />)}
        </div>
      </div>
      <div className="w-full h-auto flex flex-col justify-start items-start mt-4">
        <label>Confirm Password</label>
        <div className="w-full h-full flex justify-between items-center rounded-md pr-6 bg-gray-300">
          <input type={showPassword ? "text" : "password"} name="confirmPassword" value={updatePasswordInput.confirmPassword} onChange={handleInputChange} className="w-full h-full p-2 outline-none bg-gray-300 rounded-md" placeholder="Re-Enter your new password to confirm" autoComplete="off" />
          {showPassword ? (
            <FaRegEyeSlash
              className="eye_icon cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            />
          ) : (
            <FaEye
              className="eye_icon"
              onClick={() => setShowPassword(!showPassword)}
            />
          )}</div>
      </div>
      <div className="save_change_btn_wrapper">
        <button className="btn mt-8 px-8 py-2 bg-green-500 text-white rounded-md flex justify-center items-center gap-4" onClick={handleUpdatePassword}>Update Password <LuLoader2 className={`${(loading)?"animate-spin text-xl":"hidden"}`}/></button>
      </div>
    </form>
  );
};

export default UpdatePassword;
