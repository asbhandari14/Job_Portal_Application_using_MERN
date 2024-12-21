import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { requestForPostJob, successForPostJob, failureForPostJob } from "../store/slices/jobSlice";
import { CiCircleInfo } from "react-icons/ci";
import axios from "axios";

const JobPost = ({url}) => {
  const [jobPost, setJobPost] = useState({
    title : "",
    jobType : "",
    location : "",
    companyName : "",
    introduction : "",
    responsibilities : "",
    qualifications : "",
    offers : "",
    jobCategory : "",
    salary : "",
    hiringMultipleCandidates : "",
    personalWebsiteTitle : "",
    personalWebsiteUrl : ""
  });

  const categoryArray = [ "Software Development", "Web Development", "Cybersecurity", "Data Science", "Artificial Intelligence", "Cloud Computing", "DevOps", "Mobile App Development", "Blockchain", "Database Administration", "Network Administration", "UI/UX Design", "Game Development", "IoT (Internet of Things)", "Big Data", "Machine Learning", "IT Project Management", "IT Support and Helpdesk", "Systems Administration", "IT Consulting"];

  const cities = [ "Any City", "Lucknow", "Varanshi", "Kanpur", "Ghaziabad", "Agra", "Mirzapur", "Noida", "Bareilly", "Allahbad", "Merut", "Jhansi", "Mathura", "Gorakpur", "Vrindavan", "Rampur", "Delhi",
  ];

  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { loading, error, message } = useSelector((state) => state.jobs);
  const dispatch = useDispatch();


  const handleInputChange=(e)=>{
    let {name, value} = e.target;
    setJobPost({...jobPost, [name] : value});
  }

  const handlePostJob =async(e) => {
    dispatch(requestForPostJob())

    try {
      const response = await axios.post(`${url}/job/post`, jobPost, {withCredentials : true, headers : {"Content-Type" : "application/json"}});

      if(response.data.success){
        const notify=()=>{toast.success(response.data.mssg)};
        notify();
        dispatch(successForPostJob(response.data.mssg));
      }
    } catch (error) {
      console.log(error);
      const notify=()=>{toast.error(error.response.data.mssg)};
      notify();
      dispatch(failureForPostJob(error.response.data.mssg));
    }
  };


  return (
    <div className="account_components w-full flex flex-col justify-start items-start gap-3">
      <h3 className="text-xl font-semibold my-3">Post A Job</h3>
      <div className="w-full flex flex-col justify-start items-start gap-1">
        <label className="font-semibold">Title</label>
        <input type="text" name="title" value={jobPost.title} onChange={handleInputChange} placeholder="Job Title" className="w-full p-2 rounded-md bg-gray-300 outline-none" />
      </div>
      <div className="w-full flex flex-col justify-start items-start gap-2">
        <label className="font-semibold">Job Type</label>
        <select name="jobType" value={jobPost.jobType} onChange={handleInputChange} className="w-full p-2 rounded-md bg-gray-300 outline-none">
          <option value="">Select Job Type</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
        </select>
      </div>
      <div className="w-full flex flex-col justify-start items-start gap-2">
        <label className="font-semibold">Location (City)</label>
        <select name="location" value={jobPost.location} onChange={handleInputChange} className="w-full p-2 rounded-md bg-gray-300 outline-none">
          <option value="">Select Job Type</option>
          {cities.map((element) => {
            return <option key={element} value={element}>{element}</option>;
          })}
        </select>
      </div>
      <div className="w-full flex flex-col justify-start items-start gap-2">
        <label className="font-semibold">Company Name</label>
        <input name="companyName" type="text" value={jobPost.companyName} onChange={handleInputChange} placeholder="Company Name" className="w-full p-2 rounded-md bg-gray-300 outline-none" />
      </div>
      <div className="w-full flex flex-col justify-start items-start gap-2">
        <label className="font-semibold">Company/Job Description</label>
        <textarea name="introduction" value={jobPost.introduction} onChange={handleInputChange} placeholder="Company / Job Introduction" rows={7} className="w-full p-2 rounded-md bg-gray-300 outline-none" />
      </div>
      <div className="w-full flex flex-col justify-start items-start gap-2">
        <label className="font-semibold">Responsibilities</label>
        <textarea name="responsibilities" value={jobPost.responsibilities} onChange={handleInputChange} placeholder="Job Responsibilities" rows={7} className="w-full p-2 rounded-md bg-gray-300 outline-none" />
      </div>
      <div className="w-full flex flex-col justify-start items-start gap-2">
        <label className="font-semibold">Qualifications</label>
        <textarea name="qualifications" value={jobPost.qualifications} onChange={handleInputChange} placeholder="Required Qualifications For Job" rows={7} className="w-full p-2 rounded-md bg-gray-300 outline-none"/>
      </div>
      <div className="w-full flex flex-col justify-start items-start gap-2">
        <div className="label-infoTag-wrapper flex justify-start items-center gap-6">
          <label className="font-semibold">What We Offer</label>
          <span className="flex justify-center items-center gap-2">
            <CiCircleInfo /> Optional
          </span>
        </div>
        <textarea name="offers" value={jobPost.offers} onChange={handleInputChange} placeholder="What are we offering in return!" rows={7} className="w-full p-2 rounded-md bg-gray-300 outline-none" />
      </div>
      <div className="w-full flex flex-col justify-start items-start gap-2">
        <label className="font-semibold">Job Category</label>
        <select name="jobCategory" value={jobPost.jobCategory} onChange={handleInputChange} className="w-full p-2 rounded-md bg-gray-300 outline-none">
          <option value="">Select Job category</option>
          {categoryArray.map((element) => {
            return <option key={element} value={element}>{element}</option>;
          })}
        </select>
      </div>
      <div className="w-full flex flex-col justify-start items-start gap-2">
        <label className="font-semibold">Salary</label>
        <input type="text" name="salary" value={jobPost.salary} onChange={handleInputChange} placeholder="50000 - 800000" className="w-full p-2 rounded-md bg-gray-300 outline-none" />
      </div>
      <div className="w-full flex flex-col justify-start items-start gap-2">
        <div className="label-infoTag-wrapper flex items-center gap-6">
          <label className="font-semibold">Hiring Multiple Candidates?</label>
          <span className="flex justify-center items-center gap-2">
            <CiCircleInfo /> Optional
          </span>
        </div>
        <select name="hiringMultipleCandidates" value={jobPost.hiringMultipleCandidates} onChange={handleInputChange} className="w-full p-2 rounded-md bg-gray-300 outline-none">
          <option value="">Hiring Multiple Candidates?</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div className="w-full flex flex-col justify-start items-start gap-2">
        <div className="label-infoTag-wrapper flex items-center gap-6">
          <label className="font-semibold">Personal Website Name</label>
          <span className="flex justify-center items-center gap-2">
            <CiCircleInfo /> Optional
          </span>
        </div>
        <input type="text" name="personalWebsiteTitle" value={jobPost.personalWebsiteTitle} onChange={handleInputChange} placeholder="Peronsal Website Name/Title" className="w-full p-2 rounded-md bg-gray-300 outline-none" />
      </div>
      <div className="w-full flex flex-col justify-start items-start gap-2">
        <div className="label-infoTag-wrapper flex items-center gap-6">
          <label className="font-semibold">Personal Website Link (URL)</label>
          <span className="flex justify-center items-center gap-2">
            <CiCircleInfo /> Optional
          </span>
        </div>
        <input type="text" name="personalWebsiteUrl" value={jobPost.personalWebsiteUrl} onChange={handleInputChange} placeholder="Peronsal Website Link (URL)" className="w-full p-2 rounded-md bg-gray-300 outline-none"/>
      </div>
      <div className="mt-4">
        <button style={{ margin: "0 auto" }} className="btn py-2 px-6 bg-green-400 font-semibold text-white rounded-md" onClick={handlePostJob} disabled={loading}>Post Job</button>
      </div>
    </div>
  );
};

export default JobPost;
