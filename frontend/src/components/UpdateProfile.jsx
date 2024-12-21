import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LuLoader2 } from "react-icons/lu";
import { updateProfileSuccess, updateProfileRequest, updateProfileFailed } from "../store/slices/updateProfileSlice";
import { fetchUserSuccess } from "../store/slices/userSlice";



const UpdateProfile = ({url}) => {
  const [updateProfileInput, setUpdateProfileInput] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    coverLetter: "",
    categoryFirst: "",
    categorySecond: "",
    categoryThird: "",
    resume: "",
    resumePreview: ""
  })

  const { user } = useSelector((state) => state.user);
  const { loading, error, isUpdated } = useSelector((state) => state.updateProfile);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateProfileInput({ ...updateProfileInput, [name]: value })
  }

  const handleUpdateProfile = async () => {
    dispatch(updateProfileRequest())
    const formData = new FormData();
    formData.append("name", updateProfileInput?.name);
    formData.append("email", updateProfileInput?.email);
    formData.append("phone", updateProfileInput?.phone);
    formData.append("address", updateProfileInput?.address);
    if (user[0]?.role === "Job Seeker") {
      formData.append("categoryFirst", updateProfileInput?.categoryFirst);
      formData.append("categorySecond", updateProfileInput?.categorySecond);
      formData.append("categoryThird", updateProfileInput?.categoryThird);
    }
    formData.append("coverLetter", updateProfileInput?.coverLetter);
    if (updateProfileInput?.resume) {
      formData.append("resume", updateProfileInput?.resume);
    }
    try {
      const response = await axios.put(`${url}/user/update/profile`, formData, { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } })

      if (response.data.success) {
        dispatch(fetchUserSuccess(response?.data?.user));
        const notify = () => { toast.success(response?.data?.mssg) };
        notify();
        navigate("/");
        dispatch(updateProfileSuccess());
      }
    } catch (error) {
      dispatch(updateProfileFailed(error?.response?.data?.mssg))
      console.log(error);
      const notify = () => { toast.error(error?.response?.data?.mssg) };
      notify();
    }
  };

  const resumeHandler = (e) => {
    const file = e.target.files[0];
    setUpdateProfileInput({ ...updateProfileInput, resume: file })
  };

  const categoryArray = ["Software Development", "Web Development", "Cybersecurity", "Data Science", "Artificial Intelligence", "Cloud Computing", "DevOps", "Mobile App Development", "Blockchain", "Database Administration", "Network Administration", "UI/UX Design", "Game Development", "IoT (Internet of Things)", "Big Data", "Machine Learning", "IT Project Management", "IT Support and Helpdesk", "Systems Administration", "IT Consulting"];


  useEffect(() => {
    if (user) {
      setUpdateProfileInput({ ...updateProfileInput, name: user[0]?.name, email: user[0]?.email, phone: user[0]?.phone, address: user[0]?.address, coverLetter: user[0]?.coverLetter, resume: user[0]?.resume, categoryFirst: user[0]?.category?.categoryFirst, categorySecond: user[0]?.category?.categorySecond, categoryThird: user[0]?.category?.categoryThird });
    }
  }, [user])

  return (
    <div className="account_components w-full h-auto flex flex-col justify-start items-start gap-4">

      <h3 className="text-xl font-semibold my-3">Update Profile</h3>

      <div className="w-full h-full flex flex-col justify-start items-start">
        <label className="font-semibold">Full Name</label>
        <input type="text" placeholder="Enter your Name" name="name" value={updateProfileInput.name} onChange={handleInputChange} className="w-full p-2 bg-gray-300 rounded-md" />
      </div>

      <div className="w-full h-full flex flex-col justify-start items-start">
        <label className="font-semibold">Email Address</label>
        <input type="email" placeholder="Enter your Email" name="email" value={updateProfileInput.email} onChange={handleInputChange} className="w-full p-2 bg-gray-300 rounded-md" />
      </div>

      <div className="w-full h-full flex flex-col justify-start items-start">
        <label className="font-semibold">Phone Number</label>
        <input type="number" placeholder="Enter your Phone" name="phone" value={updateProfileInput.phone} onChange={handleInputChange} className="w-full p-2 bg-gray-300 rounded-md" />
      </div>

      <div className="w-full h-full flex flex-col justify-start items-start">
        <label className="font-semibold">Address</label>
        <input type="text" placeholder="Enter your address Address" name="address" value={updateProfileInput.address} onChange={handleInputChange} className="w-full p-2 bg-gray-300 rounded-md" />
      </div>

      {user && user[0].role === "Job Seeker" && (
        <>
          <div className="w-full h-full flex flex-col justify-start items-start gap-3">
            <label className="font-semibold">My Preferred Job Niches</label>
            <div className="w-full flex flex-col gap-3">
              <div>
                <label htmlFor="" className="font-semibold text-sm uppercase">First Preffered Job Category</label>
                <select value={updateProfileInput.categoryFirst} onChange={handleInputChange} className="w-full p-2 bg-gray-300 rounded-md">
                  {categoryArray?.map((element, index) => {
                    return (
                      <option value={element} key={index}>
                        {element}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label htmlFor="" className="font-semibold text-sm uppercase">Second Preffered Job Category </label>
                <select value={updateProfileInput.categorySecond} onChange={handleInputChange} className="w-full p-2 bg-gray-300 rounded-md">
                  {categoryArray.map((element, index) => {
                    return (
                      <option value={element} key={index}>
                        {element}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label htmlFor="" className="font-semibold text-sm uppercase">Thired Preffered Job Category</label>
                <select value={updateProfileInput.categoryThird} onChange={handleInputChange} className="w-full p-2 bg-gray-300 rounded-md">
                  {categoryArray.map((element, index) => {
                    return (
                      <option value={element} key={index}>
                        {element}
                      </option>
                    );
                  })}
                </select>
              </div>



            </div>
          </div>
          <div className="w-full h-full flex flex-col justify-start items-start ">
            <label className="font-semibold">Coverletter</label>
            <textarea placeholder="Write something for your cover letter" value={updateProfileInput.coverLetter} onChange={handleInputChange} rows={5} className="w-full p-2 bg-gray-300 rounded-md" />
          </div>
          <div className="w-full h-full flex flex-col justify-start items-start gap-3">
            <label className="font-semibold">Upload Resume</label>
            <input type="file" onChange={resumeHandler} className="w-full p-2 bg-gray-300 rounded-md" />
            {user[0].resume && (
              <div className="w-full flex flex-col justify-start items-start gap-2 ">
                <p className="font-semibold">Current Resume:</p>
                <Link to={user[0].resume.url} target="_blank" className="view-resume w-full p-2 bg-gray-300  rounded-md">
                  View Resume
                </Link>
              </div>
            )}
          </div>
        </>
      )}
      <button className="btn py-2 px-6 bg-green-500 text-white rounded-md my-4  flex justify-center items-center gap-4" onClick={handleUpdateProfile} disabled={loading}>Save Changes <LuLoader2 className={`${(loading) ? "animate-spin text-xl" : "hidden"}`} /></button>
    </div>
  );
};

export default UpdateProfile;
