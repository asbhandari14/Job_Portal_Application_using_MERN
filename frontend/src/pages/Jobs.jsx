import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { clearAllJobErrors, fetchJobs } from "../store/slices/jobSlice";
import { requestForAllJobs, successForAllJobs, failureForAllJobs } from "../store/slices/jobSlice";
import Spinner from "../components/Spinner";
import { FaSearch } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const Jobs = ({url}) => {
  const [city, setCity] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [jobCategory, setJobCategory] = useState("");
  const [selectedJobCategory, setSelectedJobCategory] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const dispatch = useDispatch();
  const { jobs, loading, error } = useSelector((state) => state.jobs);
  const { token } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const notify = () => toast.error("You Need to Login first");


  const handleApplyNow = (jobId) => {
    if (token) {
      navigate(`/post/application/${jobId}`)
    }
    else {
      notify();
    }
  }

  const handleCityChange = (city) => {
    setCity(city);
    setSelectedCity(city);
  }

  const handleCategoryChange = (jobCategory) => {
    setJobCategory(jobCategory);
    setSelectedJobCategory(jobCategory);
  };


  const fetchAllJobs = async () => {
    try {
      dispatch(requestForAllJobs());
      const response = await axios.get(`${url}/job/getAll?searchKeyword=${searchKeyword}&city=${selectedCity}&category=${jobCategory}`, { withCredentials: true, headers: { "Content-Type": "application/json" } });

      if (response.data.success) {
        dispatch(successForAllJobs(response.data.jobs));
      }

    } catch (error) {
      console.log(error);
      dispatch(failureForAllJobs(error.response.data.mssg))
    }
  }


  useEffect(() => {
    fetchAllJobs();
  }, [city, jobCategory])

  const handleSearch = () => {
    fetchAllJobs();
  };

  const cities = [ "Any City", "Lucknow", "Varanshi", "Kanpur", "Ghaziabad", "Agra", "Mirzapur", "Noida", "Bareilly", "Allahbad", "Merut", "Jhansi", "Mathura", "Gorakpur", "Vrindavan", "Rampur", "Delhi",
  ];

  const categoryArray = [ "Any Job", "Software Development", "Web Development", "Cybersecurity", "Data Science", "Artificial Intelligence", "Cloud Computing", "DevOps", "Mobile App Development", "Blockchain", "Database Administration", "Network Administration", "UI/UX Design", "Game Development", "IoT (Internet of Things)", "Big Data", "Machine Learning", "IT Project Management", "IT Support and Helpdesk", "Systems Administration", "IT Consulting"];

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="job_outer_container w-full h-auto flex justify-center items-center">
          <section className="jobs w-[95%] h-auto container flex flex-col justify-center items-center mx-auto">
            <form onSubmit={handleSearch} className="search-tab-wrapper w-[60%] border border-gray-400 shadow-md my-6 flex justify-between items-center rounded-md">
              <input type="text" className=" w-full px-3 text-lg text-zinc-600 outline-none" placeholder="Enter the you Job here" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)}
              />
              <button type="submit" className="w-[20%] p-3 bg-green-400 text-white flex justify-center items-center gap-3 font-semibold" onClick={handleSearch}>Find Here<FaSearch /></button>

            </form>
            <div className="wrapper w-full grid grid-cols-[1fr_3fr] justify-items-center">
              <div className="filter-bar w-full flex flex-col items-start justify-start my-12">
                <div className="cities">
                  <h2 className="text-2xl font-semibold my-3">Filter Job By City</h2>
                  {cities.map((currVal, index) => (
                    <div key={index}>
                      <input type="radio" id={currVal} name="city" value={currVal} checked={selectedCity == currVal} onChange={() => { handleCityChange(currVal) }} />
                      <label htmlFor={currVal}>{currVal}</label>
                    </div>
                  ))}
                </div>
                <div className="cities">
                  <h2 className="text-2xl font-semibold my-3">Filter Job By Niche</h2>
                  {categoryArray.map((currVal, index) => (
                    <div key={index}>
                      <input type="radio" id={currVal} name="jobCategory" value={(currVal == "Any Job") ? "" : currVal} checked={selectedJobCategory === currVal} onChange={() => handleCategoryChange(currVal)} />
                      <label htmlFor={currVal}>{currVal}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="container flex flex-col items-center justify-start my-16">
                <div className="mobile-filter hidden">
                  <select value={city} onChange={(e) => setCity(e.target.value)}>
                    <option value="">Filter By City</option>
                    {cities.map((city, index) => (
                      <option value={city} key={index}>
                        {city}
                      </option>
                    ))}
                  </select>
                  <select
                    value={jobCategory}
                    onChange={(e) => setJobCategory(e.target.value)}
                  >
                    <option value="">Filter By Job Category</option>
                    {categoryArray.map((jobCategory, index) => (
                      <option value={jobCategory} key={index}>
                        {jobCategory}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="jobs_container w-[80%] flex flex-col justify-start items-start gap-6">
                  {jobs &&
                    jobs.map((currElem) => {
                      return (
                        <div className="card border w-full border-gray-400 shadow-md py-6 px-8 rounded-md flex flex-col gap-1" key={currElem._id}>
                          {currElem.hiringMultipleCandidates === "Yes" ? (
                            <span className="hiring-multiple text-sm text-green-700">Hiring Multiple Candidates</span>
                          ) : (
                            <span className="hiring">Hiring</span>
                          )}
                          <p className="title text-2xl font-semibold">{currElem.title}</p>
                          <p className="company text-zinc-600">{currElem.companyName}</p>
                          <p className="location text-zinc-600">{currElem.location}</p>
                          <p className="salary">
                            <span className="font-semibold">Salary :</span> {currElem.salary}
                          </p>
                          <p className="posted">
                            <span className="font-semibold">Posted On:</span>{" "}
                            {currElem.jobPostedOn.substring(0, 10)}
                          </p>
                          <div className="btn-wrapper self-end">
                            <button className=" bg-red-500 text-white px-4 py-2 rounded-md" onClick={() => { handleApplyNow(currElem._id) }}>Apply Now</button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default Jobs;
