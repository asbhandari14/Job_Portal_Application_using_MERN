import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { requestForMyApplications, successForMyApplications, failureForMyApplications, requestForDeleteApplication, successForDeleteApplication, failureForDeleteApplication, resetApplicationSlice } from "../store/slices/applicationSlice";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import axios from "axios";
import { LuLoader2 } from "react-icons/lu";



const MyApplications=({url}) => {
  const { user } = useSelector((state) => state.user);
  const { loading, applications } = useSelector((state) => state.applications);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const fetchUserAllJobApplication=async()=>{
    try {
      dispatch(requestForMyApplications());
      const response = await axios.get(`${url}/application/jobSeeker/getAll`, {withCredentials: true});
      if(response.data.success){
        dispatch(successForMyApplications(response.data.applications));
      }
    } catch (error) {
      console.log(error);
      failureForMyApplications(error?.response?.data?.mssg);
    }
  }

  const handleDeleteApplication=async(jobId) => {
    dispatch(requestForDeleteApplication());
    try {
      const response = await axios.delete(`${url}/application/delete/${jobId}`, {withCredentials: true});
      if(response.data.success){
        const notify=()=>{toast.success("Application has successfully deleted from user side")};
        notify();
        dispatch(successForDeleteApplication(response?.data?.mssg));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      const notify=()=>{toast.warning(error.response.data.mssg)};
      notify();
      dispatch(failureForDeleteApplication(error?.response?.data?.mssg))
    }
    finally{
      dispatch(resetApplicationSlice());
    }
  };


  useEffect(()=>{
    fetchUserAllJobApplication();
  }, [user])

  return (
    <>
      {loading ? (
        <Spinner />
      ) : applications && applications.length <= 0 ? (
        <h1 style={{ fontSize: "1.4rem", fontWeight: "600" }}>
          You have not applied for any job.
        </h1>
      ) : (
        <>
          <div className="account_components">
            <h3 className="text-xl font-semibold py-3">My Application For Jobs</h3>
            <div className="applications_container w-full flex flex-col justify-start items-start gap-6 my-6">
              {applications[0]?.map((element) => {
                return (
                  <div className="card w-full p-8 border border-gray-400 shadow-md rounded-md flex flex-col justify-start items-start gap-2" key={element._id}>
                    <p className="sub-sec flex flex-col text-sm text-zinc-600">
                      <span className="text-lg font-semibold text-black">Job Title : </span> {element?.jobInfo?.jobTitle}
                    </p>
                    <p className="sub-sec flex flex-col text-sm text-zinc-600">
                      <span className="text-lg font-semibold text-black">Name</span> {element?.jobSeekerInfo?.name}
                    </p>
                    <p className="sub-sec flex flex-col text-sm text-zinc-600">
                      <span className="text-lg font-semibold text-black">Email</span> {element?.jobSeekerInfo?.email}
                    </p>
                    <p className="sub-sec flex flex-col text-sm text-zinc-600">
                      <span className="text-lg font-semibold text-black">Phone: </span> {element?.jobSeekerInfo?.phone}
                    </p>
                    <p className="sub-sec flex flex-col text-sm text-zinc-600">
                      <span className="text-lg font-semibold text-black">Address: </span> {element?.jobSeekerInfo?.address}
                    </p>
                    <p className="sub-sec w-full flex flex-col text-sm text-zinc-600">
                      <span className="text-lg font-semibold text-black">Coverletter: </span>
                      <textarea value={element?.jobSeekerInfo?.coverLetter} rows={5} disabled className="w-full p-3"></textarea>
                    </p>
                    <div className="btn-wrapper w-full flex justify-end gap-3 mt-4">
                      <button className="outline_btn py-2.5 px-8 bg-red-300 flex justify-center itemc gap-4" onClick={() => handleDeleteApplication(element?._id)}> Delete Application <LuLoader2 className={`${(loading)?"animate-spin text-xl":"hidden"}`}/> </button>
                      <Link to={   element?.jobSeekerInfo &&   element?.jobSeekerInfo?.resume?.url } className="btn py-2.5 px-8 bg-green-300" target="_blank">View Resume</Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MyApplications;
