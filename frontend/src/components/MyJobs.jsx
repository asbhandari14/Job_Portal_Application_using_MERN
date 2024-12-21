import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { requestForMyJobs, successForMyJobs, failureForMyJobs } from "../store/slices/jobSlice";
import Spinner from "../components/Spinner";
import axios from "axios";


const MyJobs = ({url}) => {
  const { loading, error, myJobs, message } = useSelector((state) => state.jobs);
  const dispatch = useDispatch();

  const fetchMyJob=async()=>{
    try {
      dispatch(requestForMyJobs());
      const response = await axios.get(`${url}/job/getAll`, {withCredentials: true});

      if(response.data.success){
        dispatch(successForMyJobs(response.data.jobs));
      }
    } catch (error) {
      console.log(error);
      dispatch(failureForMyJobs(error.response.data.mssg))
    }
  }

  useEffect(()=>{
    fetchMyJob();
  }, [])

  return (
    <>
      {loading ? (
        <Spinner />
      ) : myJobs && myJobs.length <= 0 ? (
        <h1 style={{ fontSize: "1.4rem", fontWeight: "600" }}>
          You have not posted any job!
        </h1>
      ) : (
        <>
          <div className="account_components w-full flex flex-col justify-start items-start">
            <h3 className="text-xl font-semibold my-3">My Jobs</h3>
            <div className="applications_container w-full flex flex-col gap-8">
              {myJobs[0]?.map((element) => (
                <div className="card  border border-gray-400 shadow-md p-8 rounded-md flex flex-col gap-3" key={element._id}>
                  <p className="sub-sec flex flex-col justify-start items-start text-zinc-600"> <span className="font-semibold text-lg text-black">Job Title : </span> {element.title}</p>
                  <p className="sub-sec flex flex-col justify-start items-start text-zinc-600"> <span className="font-semibold text-lg text-black">Job Niche :</span> {element.jobCategory}</p>
                  <p className="sub-sec flex flex-col justify-start items-start text-zinc-600"><span className="font-semibold text-lg text-black">Salary : </span> {element.salary}</p>
                  <p className="sub-sec flex flex-col justify-start items-start text-zinc-600"><span className="font-semibold text-lg text-black">Location :</span> {element.location}</p>
                  <p className="sub-sec flex flex-col justify-start items-start text-zinc-600"><span className="font-semibold text-lg text-black">Job Type :</span> {element.jobType}</p>
                  <p className="sub-sec flex flex-col justify-start items-start text-zinc-600"><span className="font-semibold text-lg text-black">Company Name :</span> {element.companyName}</p>
                  <p className="sub-sec flex flex-col justify-start items-start text-zinc-600"><span className="font-semibold text-lg text-black">Introduction :</span> {element.introduction}</p>
                  <p className="sub-sec flex flex-col justify-start items-start text-zinc-600"><span className="font-semibold text-lg text-black">Qualifications :</span> {element.qualifications}</p>
                  <p className="sub-sec flex flex-col justify-start items-start text-zinc-600"><span className="font-semibold text-lg text-black">Responsibilities :</span> {element.responsibilities}</p>
                  {element.offers && (
                  <p className="sub-sec flex flex-col justify-start items-start text-zinc-600"> <span className="font-semibold text-lg text-black">What Are We Offering:</span> {element.offers}</p>
                  )}
                  <button className=" btn mt-6 py-2 px-8 bg-red-400 rounded-md" onClick={() => handleDeleteJob(element._id)}>Delete Job</button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MyJobs;
