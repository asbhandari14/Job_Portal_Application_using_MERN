import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { requestForSingleJob, successForSingleJob, failureForSingleJob } from "../store/slices/jobSlice";
import { requestForPostApplication, successForPostApplication, failureForPostApplication } from "../store/slices/applicationSlice";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { IoMdCash } from "react-icons/io";
import { FaToolbox } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { LuLoader2 } from "react-icons/lu";
import axios from "axios";

const PostApplication = ({url}) => {
  const [postApplicationInput, setPostApplicationInput] = useState({ name: "", email: "", phone: "", address: "", coverLetter: "", resume: "" });
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);

  const { singleJob } = useSelector((state) => state.jobs);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { loading } = useSelector((state) => state.applications);
  const { jobId } = useParams();


  const navigateTo = useNavigate();
  const dispatch = useDispatch();


  const resumeHandler = (e) => {
    const file = e.target.files[0];
    setPostApplicationInput({ ...postApplicationInput, resume: file });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostApplicationInput({ ...postApplicationInput, [name]: value })
  }

  const checkAlreadyAppliedOrNot = async () => {
    try {
      const response = await axios.get(`${url}/application/applied/${jobId}`, { withCredentials: true });
      if (response.data.success) {
        setIsAlreadyApplied(true);
      }
    } catch (error) {
      setIsAlreadyApplied(false);
      console.log(error);
    }
  }

  const fetchSinglJob = async () => {
    try {
      dispatch(requestForSingleJob());
      const response = await axios.get(`${url}/job/get/${jobId}`, { withCredentials: true });
      if (response.data.success) {
        dispatch(successForSingleJob(response.data.job));
      }
    } catch (error) {
      console.log(error);
      dispatch(failureForSingleJob(error.response.data.mssg));
    }
  }


  const handlePostApplication = async (e) => {
    e.preventDefault();
    if (!postApplicationInput.resume || !postApplicationInput.coverLetter) {
      const notify = () => { toast.error("Please enter your Resume or Cover letter detail") };
      notify();
    }
    else {
      const formData = new FormData();
      formData.append("name", postApplicationInput.name);
      formData.append("email", postApplicationInput.email);
      formData.append("phone", postApplicationInput.phone);
      formData.append("address", postApplicationInput.address);
      formData.append("coverLetter", postApplicationInput.coverLetter);
      if (postApplicationInput.resume) {
        formData.append("resume", postApplicationInput.resume);
      }
      try {
        dispatch(requestForPostApplication());
        const response = await axios.post(`${url}/application/post/${jobId}`, formData, { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true });
        if (response.data.success) {
          dispatch(successForPostApplication(response.data.mssg));
          const notify = () => toast.success("Successfully Applied");
          notify();
          checkAlreadyAppliedOrNot();
        }

      } catch (error) {
        dispatch(failureForPostApplication(error.response.data.mssg))
        const notify2 = () => { toast.error(error.response.data.mssg) };
        console.log(error);
        notify2();
      }
    }
  };


  useEffect(() => {
    fetchSinglJob();
    checkAlreadyAppliedOrNot();
    if(user){
      setPostApplicationInput({...postApplicationInput, name : user[0]?.name, email : user[0]?.email, phone : user[0]?.phone, address: user[0]?.address, coverLetter : user[0]?.coverLetter, resume: user[0]?.resume?.url})
    } 
  }, []);


  return (
    <>
      <article className="application_page w-[95%] h-auto container mx-auto grid grid-cols-2 gap-6">
        <form className="w-full h-auto flex flex-col justify-start items-start gap-2">
          <h3 className="text-2xl font-semibold my-4">Application Form</h3>
          <div className="w-full h-auto flex flex-col">
            <label className="ml-2 font-semibold">Job Title</label>
            <input type="text" value={singleJob?.title} disabled className="p-2.5 rounded-md bg-slate-100" />
          </div>
          <div className="w-full h-auto flex flex-col">
            <label className="ml-2 font-semibold">Your Name</label>
            <input type="text" name="name" value={postApplicationInput.name} placeholder="Enter your name" disabled onChange={handleInputChange} className="p-2.5 rounded-md bg-slate-100" />
          </div>
          <div className="w-full h-auto flex flex-col">
            <label className="ml-2 font-semibold">Your Email</label>
            <input type="email" name="email" placeholder="Enter your email" disabled value={postApplicationInput.email} onChange={handleInputChange} className="p-2.5 rounded-md bg-slate-100" />
          </div>
          <div className="w-full h-auto flex flex-col">
            <label className="ml-2 font-semibold">Phone Number</label>
            <input type="number" name="phone" placeholder="Enter your phone" disabled value={postApplicationInput.phone} onChange={handleInputChange} className="p-2.5 rounded-md bg-slate-100" />
          </div>
          <div className="w-full h-auto flex flex-col">
            <label className="ml-2 font-semibold">Address</label>
            <input type="text" name="address" placeholder="Enter your address" disabled value={postApplicationInput.address} onChange={handleInputChange} className="p-2.5 rounded-md bg-slate-100" />
          </div>
          {/* {user && user.role === "Job Seeker" && ( */}
          <>
            <div className="w-full h-auto flex flex-col">
              <label className="ml-2 font-semibold">Coverletter</label>
              <textarea name="coverLetter" data-gramm="false" data-gramm_editor="false" data-enable-grammarly="false" placeholder="Write something for your cover letter" value={postApplicationInput?.coverLetter} onChange={handleInputChange} rows={10} className="p-2 bg-gray-300"
              />
            </div>
            <div className="w-full h-auto flex flex-col">
              <label className="ml-2 font-semibold">Resume</label>
              <input type="file" onChange={resumeHandler} />
            </div>
          </>
          {/* )} */}

          {/* {isAuthenticated && user[0]?.role === "Job Seeker" && ( */}
          {
            (isAlreadyApplied) ?
              <div className="self-end my-6"><button disabled className="btn bg-yellow-100 text-black px-12 py-1.5 text-lg rounded-md" onClick={handlePostApplication}> Already applied </button></div> :

              <div className="self-end my-6">
                <button className="btn bg-yellow-500 text-white px-12 py-1.5 text-lg rounded-md flex justify-center items-center gap-4" onClick={handlePostApplication}> Apply <LuLoader2 className={`${(loading)?"animate-spin text-xl":"hidden"}`}/></button>
              </div>

          }

          {/* )} */}
        </form>

        <div className="job-details text-zinc-600">
          <header className="my-2">
            <h3 className="text-2xl font-semibold">{singleJob?.title}</h3>
            {singleJob?.personalWebsite && (
              <Link target="_blank" to={singleJob?.personalWebsite.url}>
                {singleJob?.personalWebsite.title}
              </Link>
            )}
            <p className="text-sm">{singleJob?.location}</p>
            <p className="text-sm">Rs. {singleJob?.salary}</p>
          </header>
          <hr className="my-4 h-0.5 bg-zinc-600" />
          <section>
            <div className="wrapper">
              <h3 className="text-xl font-semibold">Job details</h3>
              <div className="w-full h-auto flex justify-start items-center gap-3">
                <IoMdCash className="text-lg" />
                <div className="w-full h-auto flex justify-start items-center gap-2">
                  <span>Pay</span>
                  <span>{singleJob?.salary}</span>
                </div>
              </div>
              <div className="w-full h-auto flex justify-start items-center gap-3 my-2">
                <FaToolbox className="text-lg" />
                <div className="w-full h-auto flex justify-start items-center gap-2">
                  <span>Job type</span>
                  <span>{singleJob?.jobType}</span>
                </div>
              </div>
            </div>
            <hr className="my-4 h-0.5 bg-zinc-600" />
            <div className="wrapper">
              <h3 className="text-xl font-semibold">Location</h3>
              <div className="location-wrapper w-full h-auto flex justify-start items-center gap-3">
                <FaLocationDot />
                <span>{singleJob?.location}</span>
              </div>
            </div>
            <hr className="my-4 h-0.5 bg-zinc-600" />
            <div className="wrapper flex flex-col justify-start items-start gap-2">
              <h3 className="text-xl font-semibold">Full Job Description</h3>
              <p>{singleJob.introduction}</p>
              {singleJob.qualifications && (
                <div className="wrapper flex flex-col justify-start items-start gap-2">
                  <h3 className="text-xl font-semibold">Qualifications</h3>
                  <ul>
                    {singleJob?.qualifications.split(",").map((element) => {
                      return (
                        <li key={element} style={{ listStyle: "inside" }}>
                          {element}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              {singleJob.responsibilities && (
                <div className="flex flex-col justify-start items-start gap-2">
                  <h3 className="text-xl font-semibold">Responsibilities</h3>
                  <ul>
                    {singleJob?.responsibilities?.split(",").map((element) => {
                      return (
                        <li key={element} style={{ listStyle: "inside" }}>
                          {element}
                        </li> 
                      );
                    })}
                  </ul>
                </div>
              )}
              {singleJob.offers && (
                <div className="flex flex-col justify-start items-start gap-2">
                  <h3 className="text-xl font-semibold">Offering</h3>
                  <ul>
                    {singleJob?.offers?.split(",")?.map((element) => {
                      return (
                        <li key={element} style={{ listStyle: "inside" }}>
                          {element}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </section>
          <hr className="my-4 h-0.5 bg-zinc-600" />
          <footer className="flex flex-col justify-start items-start gap-2">
            <h3 className="text-xl font-semibold">Job Category</h3>
            <p>{singleJob?.jobCategory}</p>
          </footer>
        </div>
      </article>
    </>
  );
};

export default PostApplication;
