import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import { Link } from "react-router-dom";
import { requestForAllApplications, successForAllApplications, failureForAllApplications, requestForDeleteApplication, successForDeleteApplication, failureForDeleteApplication } from "../store/slices/applicationSlice";
import axios from "axios";
import { LuLoader2 } from "react-icons/lu";

const Applications = ({url}) => {

  const {loading, applications} = useSelector((state)=>state.applications);
  const dispatch = useDispatch();

  const handleDeleteApplication=async(id)=>{
    try {
      dispatch(requestForDeleteApplication());
      const response = await axios.delete(`${url}/application/delete/${id}`, {withCredentials: true});
      if(response.data.success){
        const notify =()=>{toast.success("Successfully deleted the application")}
        notify();
        dispatch(successForDeleteApplication(response.data.mssg));
        fetchAllJobApplicationOfThisJob();
      }
    } catch (error) {
      console.log(error);
      const notify=()=>{toast.error(error.response.data.mssg)};
      notify();
      dispatch(failureForDeleteApplication(error.response.data.mssg))
    }
  }

  const fetchAllJobApplicationOfThisJob=async()=>{
    try {
      dispatch(requestForAllApplications());
      const response = await axios.get(`${url}/application/employer/getAll`, {withCredentials: true});
      if(response.data.success){
        dispatch(successForAllApplications(response.data.applications));
      }
    } catch (error) {
      console.log(error);
      dispatch(failureForAllApplications)
    }
  }



  useEffect(()=>{
    fetchAllJobApplicationOfThisJob();
  }, [])

  return (
    <>
      {loading ? (
        <Spinner />
      ) : applications && applications.length <= 0 ? (
        <h1>You have no applications from job seekers.</h1>
      ) : (
        <>
          <div className="account_components">
            <h3 className="text-xl font-semibold my-3">Applications For Your Posted Jobs</h3>
            <div className="applications_container">
              {applications.map((currElem) => {
                return (
                  <div className="card p-8 border border-gray-400 w-full flex flex-col justify-start items-start mb-6 gap-2 rounded-md shadow-md" key={currElem._id}>
                    <p className="sub-sec flex flex-col justify-start items-start text-zinc-600">
                      <span className="text-lg font-semibold text-black">Job Title: </span> {currElem.jobInfo.jobTitle}
                    </p>
                    <p className="sub-sec flex flex-col justify-start items-start text-zinc-600">
                      <span className="text-lg font-semibold text-black">Applicant's Name: </span>{" "}
                      {currElem.jobSeekerInfo.name}
                    </p>
                    <p className="sub-sec flex flex-col justify-start items-start text-zinc-600">
                      <span className="text-lg font-semibold text-black">Applicant's Email:</span>{" "}
                      {currElem.jobSeekerInfo.email}
                    </p>
                    <p className="sub-sec flex flex-col justify-start items-start text-zinc-600">
                      <span className="text-lg font-semibold text-black">Applicant's Phone: </span>{" "}
                      {currElem.jobSeekerInfo.phone}
                    </p>
                    <p className="sub-sec flex flex-col justify-start items-start text-zinc-600">
                      <span className="text-lg font-semibold text-black">Applicant's Address: </span>{" "}
                      {currElem.jobSeekerInfo.address}
                    </p>
                    <p className="sub-sec w-full flex flex-col justify-start items-start gap-2 text-zinc-600">
                      <span className="text-lg w-full font-semibold text-black">Applicant's CoverLetter: </span>
                      <textarea
                        value={currElem.jobSeekerInfo.coverLetter}
                        className="w-full bg-slate-200 p-3"
                        rows={5}
                        disabled
                      ></textarea>
                    </p>
                    <div className="btn-wrapper flex justify-start items-center gap-3 mt-4">
                      <button className="outline_btn py-3 px-4 bg-red-400 rounded-md flex justify-center items-center gap-3" onClick={() => handleDeleteApplication(currElem._id)}>Delete Application  <LuLoader2 className={`${(loading)?"animate-spin text-xl":"hidden"}`}/></button>
                      <Link to={ currElem.jobSeekerInfo && currElem.jobSeekerInfo.resume.url } className="btn py-3 px-4 bg-green-400 rounded-md" target="_blank">View Resume</Link>
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

export default Applications;
