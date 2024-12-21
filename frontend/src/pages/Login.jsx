import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginRequest, loginSuccess, loginFailed, clearAllErrors } from "../store/slices/userSlice";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { LuLoader2 } from "react-icons/lu";
import axios from "axios";


const Login = ({url}) => {
  const [loginInput, setLoginInput] = useState({ role: "", email: "", password: "" })

  const dispatch = useDispatch();
  const {loading} = useSelector((state) => state.user);
  const navigate = useNavigate();


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginInput({ ...loginInput, [name]: value });
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      dispatch(loginRequest());
      const response = await axios.post(`${url}/user/login`, loginInput, { withCredentials: true, headers: { "Content-Type": "application/json" } });

      if (response.data.success) {
        let token = response.data.token;
        let message = response.data.mssg;
        let user = response.data.user;
        const notify = () => toast.success("Logged in successfully");
        dispatch(loginSuccess({ user: user, token: token, message: message }));
        notify()
        navigate("/")
      }
    } catch (error) {
      console.log(error);
      dispatch(loginFailed(error.response.data.message));
      const notify = () => toast.error(error?.response?.data?.mssg);
      notify();
    }
    finally{
      dispatch(clearAllErrors());
    }
  };


  return (
    <>
      <section className="authPage w-full h-auto flex justify-center items-center py-12">
        <div className="login-container container w-[90%] flex flex-col justify-start items-center">
          <div className="header">
            <h3 className="text-4xl font-bold uppercase text-center">Login to your account</h3>
          </div>
          <form onSubmit={handleLogin} className="w-[70%] h-auto my-8 px-6">
            <div className="inputTag my-3">
              <label className="text-lg font-semibold flex justify-start items-center gap-3">Login As <FaRegUser /></label>

              <div>
                <select name="role" value={loginInput.role} className="w-full px-3 py-2 rounded-md border border-black" onChange={handleInputChange}>
                  <option value="">Select Role</option>
                  <option value="Employer">Login as an Employer</option>
                  <option value="Job Seeker">Login as a Job Seeker</option>
                </select>

              </div>
            </div>
            <div className="inputTag my-3">
              <label className="text-lg font-semibold flex justify-start items-center gap-3">Email <MdOutlineMailOutline /></label>
              <div>
                <input
                  type="email"
                  placeholder="demo1234@gmail.com" 
                  name="email"
                  value={loginInput.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-md border border-black"
                  autoComplete="on"
                />
              </div>
            </div>
            <div className="inputTag my-3">
              <label className="text-lg font-semibold flex justify-start items-center gap-3">Password <RiLock2Fill /></label>
              <div>
                <input
                  type="password"
                  placeholder="demo1234"
                  name="password"
                  value={loginInput.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-md border border-black"
                  autoComplete="on"
                />
              </div>
            </div>
            <button type="submit" className="px-10 py-2 bg-red-500 text-white rounded-lg text-lg font-semibold mt-3 flex justify-center items-center gap-4">Login <LuLoader2 className={`${(loading)?"animate-spin text-xl":"hidden"}`}/></button>
            <p className="my-3">Don't have an account ? Create an account here : <NavLink to='/register'><span className="text-blue-600 py-1 hover:border-b-2 hover:border-blue-600">Register</span></NavLink></p>
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;
