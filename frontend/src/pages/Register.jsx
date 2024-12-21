import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { registerFailed, registerRequest, registerSuccess } from "../store/slices/userSlice";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaAddressBook, FaPencilAlt, FaRegUser } from "react-icons/fa";
import { FaPhoneFlip } from "react-icons/fa6";
import { MdCategory, MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { LuLoader2 } from "react-icons/lu";
import axios from "axios";

const Register = ({url}) => {
  const [registerInput, setRegisterInput] = useState({ role: "", name: "", email: "", phone: "", address: "", password: "", categoryFirst: "", categorySecond: "", categoryThird: "", coverLetter: "", resume: ""})


  const { loading, isAuthenticated, error, message } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const categoryArray = ["Software Development", "Web Development", "Cybersecurity", "Data Science", "Artificial Intelligence", "Cloud Computing", "DevOps", "Mobile App Development", "Blockchain", "Database Administration", "Network Administration", "UI/UX Design", "Game Development", "IoT (Internet of Things)", "Big Data", "Machine Learning", "IT Project Management", "IT Support and Helpdesk", "Systems Administration", "IT Consulting",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterInput({ ...registerInput, [name]: value });
  }


  const resumeHandler = (e) => {
    const file = e.target.files[0];
    setRegisterInput({ ...registerInput, resume: file });
  };


  const handleRegsiter = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("role", registerInput.role);
    formData.append("name", registerInput.name);
    formData.append("email", registerInput.email);
    formData.append("phone", registerInput.phone);
    formData.append("address", registerInput.address);
    formData.append("password", registerInput.password);
    if (registerInput?.role === "Job Seeker") {
      formData.append("categoryFirst", registerInput.categoryFirst);
      formData.append("categorySecond", registerInput.categorySecond);
      formData.append("categoryThird", registerInput.categoryThird);
      formData.append("coverLetter", registerInput.coverLetter);
      formData.append("resume", registerInput.resume);
    }
    try {
      dispatch(registerRequest());
      const response = await axios.post(`${url}/user/register`, formData, { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true });

      if (response.data.success) {
        dispatch(registerSuccess({ message: response.data.mssg, user: response.data.user }));
        const notify = () => toast.success("User created successfully");
        notify();
        navigate("/")
      }
    } catch (error) {
      const notify=()=>{toast.error(error.response.data.mssg)};
      notify();
      dispatch(registerFailed());
    }
  };


  return (
    <>
      <section className="authPage w-full h-auto flex justify-center items-center py-12">
        <div className="register-container container w-[90%] flex flex-col justify-start items-center">
          <div className="header">
            <h3 className="text-4xl font-bold uppercase text-center">Create a new account</h3>
          </div>
          <form onSubmit={handleRegsiter} className="w-[70%] h-auto my-8 px-6">
            <div className="wrapper">
              <div className="inputTag my-3">
                <label className="text-lg font-semibold flex justify-start items-center gap-3">Register As <FaRegUser /></label>
                <div>
                  <select name="role" value={registerInput.role} onChange={handleInputChange} className="w-full px-3 py-2 rounded-md border border-black">
                    <option value="">Select Role</option>
                    <option value="Employer">Register as an Employer</option>
                    <option value="Job Seeker">Register as a Job Seeker</option>
                  </select>
                </div>
              </div>
              <div className="inputTag my-3">
                <label className="text-lg font-semibold flex justify-start items-center gap-3">Name <FaPencilAlt /></label>
                <div>
                  <input type="text" placeholder="Your Name" name="name" value={registerInput.name} onChange={handleInputChange} className="w-full px-3 py-2 rounded-md border border-black" autoComplete="off" />
                </div>
              </div>
            </div>
            <div className="wrapper my-3">
              <div className="inputTag">
                <label className="text-lg font-semibold flex justify-start items-center gap-3">Email Address <MdOutlineMailOutline /></label>
                <div>
                  <input type="email" placeholder="youremail@gmail.com" name="email" value={registerInput.email} onChange={handleInputChange} className="w-full px-3 py-2 rounded-md border border-black" autoComplete="off" />
                </div>
              </div>
              <div className="inputTag my-3">
                <label className="text-lg font-semibold flex justify-start items-center gap-3">Phone Number <FaPhoneFlip /></label>
                <div>
                  <input type="number" placeholder="111-222-333" name="phone" value={registerInput.phone} onChange={handleInputChange} className="w-full px-3 py-2 rounded-md border border-black" autoComplete="off" />
                </div>
              </div>
            </div>
            <div className="wrapper my-3">
              <div className="inputTag">
                <label className="text-lg font-semibold flex justify-start items-center gap-3">Address <FaAddressBook /></label>
                <div>
                  <input type="text" placeholder="Your Address" name="address" value={registerInput.address} onChange={handleInputChange} className="w-full px-3 py-2 rounded-md border border-black" autoComplete="off" />
                </div>
              </div>
              <div className="inputTag my-3">
                <label className="text-lg font-semibold flex justify-start items-center gap-3">Password <RiLock2Fill /></label>
                <div>
                  <input type="text" placeholder="Your Password" name="password" value={registerInput.password} onChange={handleInputChange} className="w-full px-3 py-2 rounded-md border border-black" autoComplete="off" />
                </div>
              </div>
            </div>
            {registerInput?.role === "Job Seeker" && (
              <>
                <div className="wrapper my-3">
                  <div className="inputTag">
                    <label className="text-lg font-semibold flex justify-start items-center gap-3">Enter your First Job Category <MdCategory /></label>
                    <div>
                      <select name="categoryFirst" value={registerInput.categoryFirst} onChange={handleInputChange} className="w-full px-3 py-2 rounded-md border border-black">
                        <option value="">Your First Job Category</option>
                        {categoryArray.map((currElem, index) => {
                          return (
                            <option key={index} value={currElem}>
                              {currElem}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="inputTag mt-3">
                    <label className="text-lg font-semibold flex justify-start items-center gap-3">Enter your second Job Category Second Niche <MdCategory /></label>
                    <div>
                      <select name="categorySecond" value={registerInput.categorySecond} onChange={handleInputChange} className="w-full px-3 py-2 rounded-md border border-black">
                        <option value="">Your Second Job Category</option>
                        {categoryArray.map((currVal, index) => {
                          return (
                            <option key={index} value={currVal}>
                              {currVal}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="inputTag mt-3">
                    <label className="text-lg font-semibold flex justify-start items-center gap-3">Enter your third Job Category  <MdCategory /></label>
                    <div>
                      <select name="categoryThird" value={registerInput.categoryThird} onChange={handleInputChange} className="w-full px-3 py-2 rounded-md border border-black">
                        <option value="">Your Third Job Category</option>
                        {categoryArray.map((niche, index) => {
                          return (
                            <option key={index} value={niche}>
                              {niche}
                            </option>
                          );
                        })}
                      </select>

                    </div>
                  </div>
                </div>
                <div className="wrapper">
                  <div className="inputTag">
                    <label>Coverletter   ( Optional ) </label>
                    <div>
                      <textarea name="coverLetter" value={registerInput.coverLetter} onChange={handleInputChange} rows={10} className="w-full px-3 py-2 rounded-md border border-black"/>
                    </div>
                  </div>
                </div>
                <div className="wrapper">
                  <div className="inputTag">
                    <label>Resume   ( Optional ) </label>
                    <div>
                      <input name="file" type="file" onChange={resumeHandler} className="border-none"/>
                    </div>
                  </div>
                </div>
              </>
            )}
            <button type="submit" disabled={loading} className="px-8 py-2 bg-red-600 text-white text-xl my-6 tracking-wider rounded-md flex justify-center items-center gap-5">Register <LuLoader2 className={`${(loading)?"animate-spin text-xl":"hidden"}`}/></button>
            <p> ALready created an account . From here you can directly go to <NavLink to="/login"><span className="text-blue-600 py-1 hover:border-b-2 hover:border-blue-600">Login Now</span></NavLink> </p>
          </form>
        </div>
      </section>
    </>
  );
};

export default Register;
