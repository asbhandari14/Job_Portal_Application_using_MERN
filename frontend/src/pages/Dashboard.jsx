import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutSuccess, loginFailed, clearAllErrors } from "../store/slices/userSlice";
import { LuMoveRight } from "react-icons/lu";
import MyProfile from "../components/MyProfile";
import UpdateProfile from "../components/UpdateProfile";
import UpdatePassword from "../components/UpdatePassword";
import MyJobs from "../components/MyJobs";
import JobPost from "../components/JobPost";
import Applications from "../components/Applications";
import MyApplications from "../components/MyApplications";
import axios from "axios";

const Dashboard = ({url}) => {
  const [show, setShow] = useState(false);
  const [componentName, setComponentName] = useState("My Profile");

  const { loading, isAuthenticated, error, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();


  const handleLogout=async()=>{
    try {
      const response = await axios.get(`${url}/user/logout`, {withCredentials: true});
    
      if(response.data.success){
        dispatch(logoutSuccess());
        const notify=()=>{toast.error(response.data.mssg)};
        notify();
        navigateTo("/")
      }
    } catch (error) {
      console.log(error)
    }

  };
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllErrors());

    }
    if (!isAuthenticated) {
      navigateTo("/");
    }
  }, [dispatch, error, loading, isAuthenticated]);

  return (
    <>
      <section className="account w-[95%] h-auto container mx-auto">
        <div className="component_header w-full flex justify-between items-center">
          <p>Dashboard</p>
          <p>
            Welcome! <span>{user && user.name}</span>
          </p>
        </div>
        <div className="container w-full grid grid-cols-[1fr_2fr] my-6">
          <div className={show ? "sidebar showSidebar" : "sidebar"}>
            <ul className="sidebar_links flex flex-col justify-start items-start gap-3">
              <h4 className="text-xl font-semibold my-3">Manage Account</h4>
              <li> <button onClick={() => { setComponentName("My Profile"); setShow(!show);}} > My Profile </button></li>
              <li><button onClick={() => { setComponentName("Update Profile"); setShow(!show); }}> Update Profile </button></li>
              <li><button onClick={() => { setComponentName("Update Password"); setShow(!show); }}> Update Password </button></li>

              {user[0]?.role === "Employer" && (
                <li><button onClick={() => { setComponentName("Job Post"); setShow(!show); }}>Post New Job</button></li>
              )}
              {user[0]?.role === "Employer" && (
                <li><button onClick={() => {setComponentName("My Jobs"); setShow(!show);}}> My Jobs</button></li>
              )}
              {user[0]?.role === "Employer" && (
                <li><button onClick={() => {setComponentName("Applications"); setShow(!show);}}>Applications</button></li>
              )}
              {user[0]?.role === "Job Seeker" && (
                <li><button onClick={() => {setComponentName("My Applications"); setShow(!show);}}>My Applications</button></li>
              )}
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
          <div className="banner">
            {/* <div className={show ? "sidebar_icon move_right" : "sidebar_icon move_left"}><LuMoveRight onClick={()=>setShow(!show)} className={show ? "left_arrow" : "right_arrow"}/></div> */}
            
            {(() => {
              switch (componentName) {
                case "My Profile":
                  return <MyProfile url={url}/>;
                  break;
                case "Update Profile":
                  return <UpdateProfile url={url}/>;
                  break;
                case "Update Password":
                  return <UpdatePassword url={url}/>;
                  break;
                case "Job Post":
                  return <JobPost url={url}/>;
                  break;
                case "My Jobs":
                  return <MyJobs url={url}/>;
                  break;
                case "Applications":
                  return <Applications url={url}/>;
                  break;
                case "My Applications":
                  return <MyApplications url={url}/>;
                  break;

                default:
                  <MyProfile url={url}/>;
                  break;
              }
            })()}
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
